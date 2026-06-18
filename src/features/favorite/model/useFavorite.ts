import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite({ onError }: { onError?: () => void } = {}) {
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
    onSuccess: invalidateAll,
    onError,
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meetings/${id}/favorites`),
    onSuccess: invalidateAll,
    onError,
  });

  const toggleFavorite = (id: number, isFavorited: boolean) => {
    if (isFavorited) remove(id);
    else add(id);
  };

  return { toggleFavorite };
}
