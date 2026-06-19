import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  decrementFavoritesCount,
  incrementFavoritesCount,
} from "@/shared/hooks/useNewFavoritesCount";
import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
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
    onError: (error) => console.error("찜 추가 실패:", error),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meetings/${id}/favorites`),
    onSuccess: () => {
      invalidateAll();
      decrementFavoritesCount();
    },
    onError: (error) => console.error("찜 취소 실패:", error),
  });

  const toggleFavorite = (id: number, isFavorited: boolean) => {
    if (isFavorited) remove(id);
    else add(id);
  };

  return { toggleFavorite };
}
