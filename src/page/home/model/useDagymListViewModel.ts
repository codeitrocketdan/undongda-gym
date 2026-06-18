"use client";

import { useJoinMeeting } from "@/features/dagym/model/useJoinMeeting";
import { MeetingListResponse } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useListQueryParams } from "@/shared/hooks/useListQueryParams";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { buildListParams } from "@/shared/lib/buildListParams";
import { meetingQueries } from "@/shared/lib/queryKeys";

export function useDagymListViewModel({
  onError,
}: { onError?: () => void } = {}) {
  const { selectedCategory, date, region, sortBy, sortOrder, typeList } =
    useListQueryParams();

  const { toggleFavorite } = useFavorite();
  const { toggleJoin } = useJoinMeeting({ onError });

  const now = new Date();

  const { items: allMeetings, observerRef } = useSuspenseInfiniteList({
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
  const meetings = selectedCategory
    ? activeMeetings
    : activeMeetings.filter((m) => typeList.includes(m.type));

  return { meetings, observerRef, toggleFavorite, toggleJoin };
}
