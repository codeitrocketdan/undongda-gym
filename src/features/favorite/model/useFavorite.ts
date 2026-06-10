import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
    queryClient.invalidateQueries({ queryKey: ["meetings"] });
    queryClient.invalidateQueries({ queryKey: ["users/me/meetings/joined"] });
    queryClient.invalidateQueries({ queryKey: ["users/me/meetings/created"] });
    queryClient.invalidateQueries({ queryKey: ["users/me/meetings/writable"] });
  };

  const { mutate: add } = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/meetings/${id}/favorites`, { method: "POST" }).then((r) => {
        if (!r.ok) throw new Error("찜 추가에 실패했어요");
        return r.json();
      }),
    onSuccess: invalidateAll,
    // TODO: 에러 처리 통일 후 적용
    onError: (error) => console.error("찜 추가 실패:", error),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/meetings/${id}/favorites`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("찜 취소에 실패했어요");
      }),
    onSuccess: invalidateAll,
    // TODO: 에러 처리 통일 후 적용
    onError: (error) => console.error("찜 취소 실패:", error),
  });

  const toggleFavorite = (id: number, isFavorited: boolean) => {
    if (isFavorited) remove(id);
    else add(id);
  };

  return { toggleFavorite };
}
