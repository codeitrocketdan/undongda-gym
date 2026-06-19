import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import {
  decrementFavoritesCount,
  incrementFavoritesCount,
} from "@/shared/hooks/useNewFavoritesCount";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    // 구조화된 쿼리키 — userMeetingQueries.all 하나로 joined/created/writable 전부 무효화
    queryClient.invalidateQueries({ queryKey: favoriteQueries.all });
    queryClient.invalidateQueries({ queryKey: meetingQueries.all });
    queryClient.invalidateQueries({ queryKey: userMeetingQueries.all });
  };

  const { mutate: add } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.post(`/api/meetings/${id}/favorites`),
    onSuccess: () => {
      invalidateAll();
      incrementFavoritesCount();
    },
    // TODO: 에러 처리 통일 후 적용
    onError: (error) => console.error("찜 추가 실패:", error),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meetings/${id}/favorites`),
    onSuccess: () => {
      invalidateAll();
      decrementFavoritesCount();
    },
    // TODO: 에러 처리 통일 후 적용
    onError: (error) => console.error("찜 취소 실패:", error),
  });

  const toggleFavorite = (id: number, isFavorited: boolean) => {
    if (isFavorited) remove(id);
    else add(id);
  };

  return { toggleFavorite };
}
