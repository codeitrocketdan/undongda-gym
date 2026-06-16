"use client";

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

const KEYS = {
  all: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
  postComments: (postId: number) =>
    ["posts", String(postId), "comments"] as const,
};

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
    refetchInterval: 60_000,
    staleTime: 60_000,
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
  commentQueries.forEach((query) => {
    const comments = (query.data as { data: CommentDTO[] } | undefined)?.data ?? [];
    comments.forEach((c) => {
      authorMap.set(c.id, { name: c.author.name, image: c.author.image });
    });
  });

  const enriched: EnrichedNotification[] = notifications.map((n) => {
    if (n.type === "COMMENT" && n.data.commentId != null) {
      const author = authorMap.get(n.data.commentId);
      return { ...n, actorName: author?.name, actorImage: author?.image ?? null };
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
      queryClient.setQueryData<NotificationListResponse>(KEYS.all, (cached) => {
        if (!cached) return cached;
        return {
          ...cached,
          data: cached.data.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ),
        };
      });
      queryClient.setQueryData<UnreadCountResponse>(KEYS.unreadCount, (cached) => {
        if (!cached) return cached;
        return { count: Math.max(0, cached.count - 1) };
      });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clientFetcher.put("/api/notifications/read-all", undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.unreadCount });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) =>
      clientFetcher.delete<void>(`/api/notifications/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.unreadCount });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clientFetcher.delete<void>("/api/notifications"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.unreadCount });
    },
  });
}
