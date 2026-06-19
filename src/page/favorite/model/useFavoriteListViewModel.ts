"use client";

import { useJoinMeeting } from "@/features/dagym/model/useJoinMeeting";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { FavoriteListResponse } from "@/features/favorite/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useListQueryParams } from "@/shared/hooks/useListQueryParams";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { buildListParams } from "@/shared/lib/buildListParams";
import { favoriteQueries } from "@/shared/lib/queryKeys";

export function useFavoriteListViewModel({ userId }: { userId?: number } = {}) {
  const { selectedCategory, date, region, sortBy, sortOrder } =
    useListQueryParams();

  const { toggleFavorite } = useFavorite();
  const { toggleJoin } = useJoinMeeting();

  const {
    items: favoriteItems,
    observerRef,
    isError,
  } = useSuspenseInfiniteList({
    queryKey: favoriteQueries.list({
      type: selectedCategory || undefined,
      date: date || undefined,
      region: region || undefined,
      sortBy,
      sortOrder,
    }),
    queryFn: (pageParam) =>
      clientFetcher.get<FavoriteListResponse>(
        `/api/favorites?${buildListParams({ type: selectedCategory, date, region, sortBy, sortOrder, cursor: pageParam })}`
      ),
  });

  const allMeetings = favoriteItems
    .map((f) => f.meeting)
    .filter((m) => m.host.id !== userId);
  const meetings = allMeetings;

  return { meetings, observerRef, toggleFavorite, toggleJoin, isError };
}
