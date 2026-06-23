import { clientFetcher } from "@/shared/api/clientFetcher";
import { postQueries } from "@/shared/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { PostDetailDTO } from "../types";
import { PostFormData } from "../ui/PostForm";

export function usePostDetail(
  postId: string,
  { onError }: { onError?: (error: unknown) => void } = {}
) {
  const query = useQuery<PostDetailDTO>({
    queryKey: postQueries.detail(postId),
    queryFn: () => clientFetcher.get<PostDetailDTO>(`/api/posts/${postId}`),
  });

  useEffect(() => {
    if (query.isError) onError?.(query.error);
  }, [query.isError, query.error, onError]);

  return query;
}

export function usePostLike(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ isLiked }: { isLiked: boolean }) =>
      isLiked
        ? clientFetcher.delete(`/api/posts/${postId}/like`)
        : clientFetcher.post(`/api/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.detail(postId) });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostFormData) => clientFetcher.post("/api/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all });
    },
  });
}

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostFormData) =>
      clientFetcher.patch(`/api/posts/${postId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all });
      queryClient.invalidateQueries({ queryKey: postQueries.hot });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      clientFetcher.delete(`/api/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all });
      queryClient.invalidateQueries({ queryKey: postQueries.hot });
    },
  });
}
