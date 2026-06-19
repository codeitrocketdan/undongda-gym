"use client";

import { ReviewListResponse } from "@/features/review/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useListQueryParams } from "@/shared/hooks/useListQueryParams";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { buildListParams } from "@/shared/lib/buildListParams";
import { reviewQueries } from "@/shared/lib/queryKeys";

export function useReviewListViewModel() {
  const { selectedCategory, date, region, sortBy, sortOrder, typeList } =
    useListQueryParams();

  const { items: allReviews, observerRef } = useSuspenseInfiniteList({
    queryKey: reviewQueries.list({
      type: selectedCategory || undefined,
      date: date || undefined,
      region: region || undefined,
      sortBy,
      sortOrder,
    }),
    queryFn: (pageParam) =>
      clientFetcher.get<ReviewListResponse>(
        `/api/reviews?${buildListParams({ type: selectedCategory, date, region, sortBy, sortOrder, size: 5, cursor: pageParam })}`
      ),
  });

  const reviews = selectedCategory
    ? allReviews
    : allReviews.filter((r) => typeList.includes(r.meeting.type));

  return { reviews, observerRef };
}
