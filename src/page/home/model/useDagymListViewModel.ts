"use client";

import { useState } from "react";
import { useJoinMeeting } from "@/features/dagym/model/useJoinMeeting";
import { MeetingListResponse } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { clientFetcher } from "@/shared/api/clientFetcher";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { useListQueryParams } from "@/shared/hooks/useListQueryParams";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";
import { useMeetingTypeList } from "@/shared/hooks/useMeetingTypeList";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { buildListParams } from "@/shared/lib/buildListParams";
import { meetingQueries } from "@/shared/lib/queryKeys";

const PAGE_SIZE = 50;
const DISPLAY_STEP = 10;

export function useDagymListViewModel() {
  const { selectedCategory, date, region, sortBy, sortOrder } =
    useListQueryParams();
  const { tab } = useMeetingCategoryTab();
  const { typeList, isReady } = useMeetingTypeList();

  const { toggleFavorite } = useFavorite();
  const { toggleJoin } = useJoinMeeting();

  const now = new Date();

  const {
    items: allMeetings,
    fetchNextPage,
    hasNextPage,
    isFetching,
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
        `/api/meetings?${buildListParams({ type: selectedCategory, date, region, sortBy, sortOrder, size: PAGE_SIZE, cursor: pageParam })}`
      ),
  });

  const activeMeetings = allMeetings.filter(
    (m) => !m.registrationEnd || new Date(m.registrationEnd) >= now
  );

  const meetings =
    selectedCategory || !isReady
      ? activeMeetings
      : activeMeetings.filter((m) => typeList.includes(m.type));

  // 탭/필터가 바뀌면 노출 개수를 처음 단계로 되돌린다
  const resetKey = `${tab}|${selectedCategory}|${date}|${region}|${sortBy}|${sortOrder}`;
  const [displayCount, setDisplayCount] = useState(DISPLAY_STEP);
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setDisplayCount(DISPLAY_STEP);
  }

  const hasBufferedMore = displayCount < meetings.length;

  // 이미 받아온 데이터가 남아있으면 추가 요청 없이 더 보여주고, 다 보여줬을 때만 다음 페이지를 요청한다
  const observerRef = useInfiniteScroll({
    fetchNextPage: () => {
      if (hasBufferedMore) {
        setDisplayCount((count) => count + DISPLAY_STEP);
      } else {
        fetchNextPage();
      }
    },
    hasNextPage: hasBufferedMore || hasNextPage,
    isFetching,
  });

  const isEmpty = meetings.length === 0 && isReady && !hasNextPage && !isFetching;

  return {
    meetings: meetings.slice(0, displayCount),
    observerRef,
    toggleFavorite,
    toggleJoin,
    isError,
    isEmpty,
  };
}
