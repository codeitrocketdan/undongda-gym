import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  decrementFavoritesCount,
  incrementFavoritesCount,
} from "@/shared/hooks/useNewFavoritesCount";
import { dagymQueries } from "@/features/dagym-detail/api/queries";
import { patchMeetingListCaches } from "@/features/dagym/lib/patchMeetingListCaches";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite() {
  const queryClient = useQueryClient();

  // 다짐 상세 캐시는 patchMeetingListCaches가 직접 고치지 않으므로(상세는 id를
  // 문자열 라우트 파라미터로 캐싱해 목록과 키 형식이 다름), 상세 화면에 들어가 있을
  // 때를 위해 계속 무효화한다. 반면 목록(홈/찜/내 다짐)은 isFavorited가 본인만
  // 바꿀 수 있는 값이라 서버와 어긋날 일이 없어 이미 위에서 낙관적으로 고친 캐시를
  // 그대로 믿어도 되고, 여기서 다시 무효화하면 무한스크롤로 불러온 페이지 수만큼
  // 불필요한 재요청이 따라붙는다.
  const invalidateDetail = () => {
    queryClient.invalidateQueries({ queryKey: dagymQueries.all });
  };

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
    onSettled: invalidateDetail,
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
    onSettled: invalidateDetail,
  });

  const toggleFavorite = (id: number, isFavorited: boolean) => {
    if (isFavorited) remove(id);
    else add(id);
  };

  return { toggleFavorite };
}
