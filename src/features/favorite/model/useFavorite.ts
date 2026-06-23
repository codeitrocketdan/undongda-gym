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
import { dagymQueries } from "@/features/dagym-detail/api/queries";
import { patchMeetingListCaches } from "@/features/dagym/lib/patchMeetingListCaches";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: favoriteQueries.all });
    queryClient.invalidateQueries({ queryKey: meetingQueries.all });
    queryClient.invalidateQueries({ queryKey: userMeetingQueries.all });
    queryClient.invalidateQueries({ queryKey: dagymQueries.all });
  };

  // 목록 캐시(홈/찜/내 다짐)를 즉시 고쳐서 버튼을 누르는 즉시 화면에 반영하고,
  // 서버 응답이 오면 onSettled에서 백그라운드로 정합성을 다시 맞춘다.
  const { mutate: add } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.post(`/api/meetings/${id}/favorites`),
    onMutate: (id) => {
      incrementFavoritesCount();
      const restore = patchMeetingListCaches(queryClient, id, (meeting) => ({
        ...meeting,
        isFavorited: true,
      }));
      return { restore };
    },
    onError: (error, _id, context) => {
      console.error("찜 추가 실패:", error);
      decrementFavoritesCount();
      context?.restore();
    },
    onSettled: invalidateAll,
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meetings/${id}/favorites`),
    onMutate: (id) => {
      decrementFavoritesCount();
      const restore = patchMeetingListCaches(queryClient, id, (meeting) => ({
        ...meeting,
        isFavorited: false,
      }));
      return { restore };
    },
    onError: (error, _id, context) => {
      console.error("찜 취소 실패:", error);
      incrementFavoritesCount();
      context?.restore();
    },
    onSettled: invalidateAll,
  });

  const toggleFavorite = (id: number, isFavorited: boolean) => {
    if (isFavorited) remove(id);
    else add(id);
  };

  return { toggleFavorite };
}
