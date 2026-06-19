import { clientFetcher } from "@/shared/api/clientFetcher";
import { postQueries } from "@/shared/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCommentActions(postId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: postQueries.detail(postId) });

  const submit = useMutation({
    mutationFn: (content: string) =>
      clientFetcher.post(`/api/posts/${postId}/comments`, { content }),
    onSuccess: invalidate,
  });

  const edit = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      clientFetcher.patch(`/api/posts/${postId}/comments/${id}`, { content }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/posts/${postId}/comments/${id}`),
    onSuccess: invalidate,
  });

  return { submit, edit, remove };
}
