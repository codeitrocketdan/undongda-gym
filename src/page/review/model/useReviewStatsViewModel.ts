"use client";

import { ReviewStatsDTO } from "@/features/review/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { reviewQueries } from "@/shared/lib/queryKeys";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import qs from "qs";

export function useReviewStatsViewModel() {
  const [selectedCategory] = useQueryState(
    "type",
    parseAsString.withDefault("")
  );

  const { data: stats } = useSuspenseQuery<ReviewStatsDTO>({
    queryKey: reviewQueries.stats(selectedCategory),
    queryFn: () => {
      const query = qs.stringify(
        { type: selectedCategory || undefined },
        { skipNulls: true }
      );
      return clientFetcher.get(`/api/reviews/statistics?${query}`);
    },
  });

  return { stats };
}
