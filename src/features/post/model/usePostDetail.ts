import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostDetailDTO } from "../types";

// TODO: serverFetcher 머지시 변경
export function usePostDetail(postId: string) {
  return useQuery<PostDetailDTO>({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${postId}`);
      return res.json();
    },
  });
}

export function usePostLike(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      const method = isLiked ? "DELETE" : "POST";
      await fetch(`/api/posts/${postId}/like`, { method });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });
}
