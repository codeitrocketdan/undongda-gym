import { MeetingWithHostDTO } from "@/features/dagym/types";
import { FavoriteWithMeetingDTO } from "@/features/favorite/types";
import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type ListData<T> = InfiniteData<{ data: T[] }>;

function mapPages<T>(old: ListData<T> | undefined, patchItem: (item: T) => T) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.map(patchItem),
    })),
  };
}

// 다짐 목록(홈/내 다짐/내가 만든 다짐), 찜 목록 캐시에 찜/참여 상태를 즉시 반영하고,
// 실패 시 되돌릴 수 있는 함수를 반환한다. (invalidateQueries로 전체 재요청하는 대신
// 화면에 보이는 캐시를 직접 고쳐서 버튼 클릭 즉시 반응하게 만든다.)
export function patchMeetingListCaches(
  queryClient: QueryClient,
  id: number,
  updater: (meeting: MeetingWithHostDTO) => MeetingWithHostDTO
) {
  const patchMeeting = <T extends MeetingWithHostDTO>(meeting: T): T =>
    meeting.id === id ? { ...meeting, ...updater(meeting) } : meeting;

  const previousMeetingLists = queryClient.getQueriesData<
    ListData<MeetingWithHostDTO>
  >({ queryKey: meetingQueries.all });
  const previousUserMeetingLists = queryClient.getQueriesData<
    ListData<MeetingWithHostDTO>
  >({ queryKey: userMeetingQueries.all });
  const previousFavoriteLists = queryClient.getQueriesData<
    ListData<FavoriteWithMeetingDTO>
  >({ queryKey: favoriteQueries.all });

  queryClient.setQueriesData<ListData<MeetingWithHostDTO>>(
    { queryKey: meetingQueries.all },
    (old) => mapPages(old, patchMeeting)
  );
  queryClient.setQueriesData<ListData<MeetingWithHostDTO>>(
    { queryKey: userMeetingQueries.all },
    (old) => mapPages(old, patchMeeting)
  );
  queryClient.setQueriesData<ListData<FavoriteWithMeetingDTO>>(
    { queryKey: favoriteQueries.all },
    (old) =>
      mapPages(old, (favorite) => ({
        ...favorite,
        meeting: patchMeeting(favorite.meeting),
      }))
  );

  return () => {
    [
      ...previousMeetingLists,
      ...previousUserMeetingLists,
      ...previousFavoriteLists,
    ].forEach(([key, data]) => queryClient.setQueryData(key, data));
  };
}
