import { CommentDTO } from "@/features/post/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  EnrichedNotification,
  NotificationListResponse,
  UnreadCountResponse,
} from "../types";
import {
  NOTIFICATION_QUERY_KEYS as KEYS,
  UNREAD_COUNT_POLLING_INTERVAL,
} from "../constants";

// setQueryData 콜백 내 변수 약어 규칙:
//   c = cached  (현재 캐시 값)
//   n = notification (개별 알림 항목)

function useNotificationList() {
  return useQuery<NotificationListResponse>({
    queryKey: KEYS.all,
    queryFn: () => clientFetcher.get<NotificationListResponse>("/api/notifications"),
  });
}

export function useUnreadCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: KEYS.unreadCount,
    queryFn: () => clientFetcher.get<UnreadCountResponse>("/api/notifications/unread-count"),
    refetchInterval: UNREAD_COUNT_POLLING_INTERVAL,
    staleTime: UNREAD_COUNT_POLLING_INTERVAL,
  });
}

export function useEnrichedNotifications() {
  const { data: listData, ...rest } = useNotificationList();
  const notifications = listData?.data ?? [];

  const uniquePostIds = [
    ...new Set(
      notifications
        .filter((n) => n.type === "COMMENT" && n.data.postId != null)
        .map((n) => n.data.postId!)
    ),
  ];

  const commentQueries = useQueries({
    queries: uniquePostIds.map((postId) => ({
      queryKey: KEYS.postComments(postId),
      queryFn: () => clientFetcher.get<{ data: CommentDTO[] }>(`/api/posts/${postId}/comments`),
    })),
  });

  const authorMap = new Map<number, { name: string; image: string | null }>();
  const postLoadingMap = new Map<number, boolean>();
  commentQueries.forEach((query, index) => {
    const postId = uniquePostIds[index];
    postLoadingMap.set(postId, query.isLoading);
    const comments = (query.data as { data: CommentDTO[] } | undefined)?.data ?? [];
    comments.forEach((comment) => {
      authorMap.set(comment.id, { name: comment.author.name, image: comment.author.image });
    });
  });

  const enriched: EnrichedNotification[] = notifications.map((n) => {
    if (n.type === "COMMENT" && n.data.commentId != null) {
      const author = authorMap.get(n.data.commentId);
      return {
        ...n,
        actorName: author?.name,
        actorImage: author?.image ?? null,
        actorLoading: postLoadingMap.get(n.data.postId!) ?? false,
      };
    }
    return n;
  });

  return { data: enriched, ...rest };
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) =>
      clientFetcher.put(`/api/notifications/${notificationId}/read`, undefined),
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<NotificationListResponse>(KEYS.all, (c) => {
        if (!c) return c;
        return {
          ...c,
          data: c.data.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
        };
      });
      queryClient.setQueryData<UnreadCountResponse>(KEYS.unreadCount, (c) => {
        if (!c) return c;
        return { count: Math.max(0, c.count - 1) };
      });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clientFetcher.put("/api/notifications/read-all", undefined),
    onSuccess: () => {
      queryClient.setQueryData<NotificationListResponse>(KEYS.all, (c) => {
        if (!c) return c;
        return { ...c, data: c.data.map((n) => ({ ...n, isRead: true })) };
      });
      queryClient.setQueryData<UnreadCountResponse>(KEYS.unreadCount, { count: 0 });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) =>
      clientFetcher.delete<void>(`/api/notifications/${notificationId}`),
    onSuccess: (_, notificationId) => {
      const snapshot = queryClient.getQueryData<NotificationListResponse>(KEYS.all);
      const deleted = snapshot?.data.find((n) => n.id === notificationId);
      queryClient.setQueryData<NotificationListResponse>(KEYS.all, (c) => {
        if (!c) return c;
        return { ...c, data: c.data.filter((n) => n.id !== notificationId) };
      });
      if (deleted && !deleted.isRead) {
        queryClient.setQueryData<UnreadCountResponse>(KEYS.unreadCount, (c) => {
          if (!c) return c;
          return { count: Math.max(0, c.count - 1) };
        });
      }
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clientFetcher.delete<void>("/api/notifications"),
    onSuccess: () => {
      queryClient.setQueryData<NotificationListResponse>(KEYS.all, (c) => {
        if (!c) return c;
        return { ...c, data: [] };
      });
      queryClient.setQueryData<UnreadCountResponse>(KEYS.unreadCount, { count: 0 });
    },
  });
}
