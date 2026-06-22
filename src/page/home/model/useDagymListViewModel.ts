"use client";

import { useJoinMeeting } from "@/features/dagym/model/useJoinMeeting";
import { MeetingListResponse } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useListQueryParams } from "@/shared/hooks/useListQueryParams";
import { useMeetingTypeList } from "@/shared/hooks/useMeetingTypeList";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { buildListParams } from "@/shared/lib/buildListParams";
import { meetingQueries } from "@/shared/lib/queryKeys";

export function useDagymListViewModel() {
  const { selectedCategory, date, region, sortBy, sortOrder } =
    useListQueryParams();
  const { typeList, isReady } = useMeetingTypeList();

  const { toggleFavorite } = useFavorite();
  const { toggleJoin } = useJoinMeeting();

  const now = new Date();

  const {
    items: allMeetings,
    observerRef,
    isError,
  } = useSuspenseInfiniteList({
    queryKey: meetingQueries.list({
      type: selectedCategory || undefined,
      date: date || undefined,
      region: region || undefined,
      sortBy,
      sortOrder,
    }),
    queryFn: (pageParam) =>
      clientFetcher.get<MeetingListResponse>(
        `/api/meetings?${buildListParams({ type: selectedCategory, date, region, sortBy, sortOrder, cursor: pageParam })}`
      ),
  });

  const activeMeetings = allMeetings.filter(
    (m) => !m.registrationEnd || new Date(m.registrationEnd) >= now
  );

  const meetings =
    selectedCategory || !isReady
      ? activeMeetings
      : activeMeetings.filter((m) => typeList.includes(m.type));

  return { meetings, observerRef, toggleFavorite, toggleJoin, isError };
}
