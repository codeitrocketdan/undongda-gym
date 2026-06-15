import { useMutation, useQueryClient } from "@tanstack/react-query";

// TODO: serverFetcher 머지시 변경
export function useCommentActions(postId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["posts", postId] });

  const submit = useMutation({
    mutationFn: async (content: string) => {
      await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: invalidate,
  });

  const edit = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      await fetch(`/api/posts/${postId}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/posts/${postId}/comments/${id}`, { method: "DELETE" });
    },
    onSuccess: invalidate,
  });

  return { submit, edit, remove };
}
