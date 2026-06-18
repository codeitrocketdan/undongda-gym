"use client";

import { DagymSort } from "@/features/dagym/components/DagymFilterBar";
import { BRANCH_OPTIONS } from "@/features/dagym/constants/region";
import { useMeetingTypes } from "@/features/dagym/model/useMeetingTypes";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { FavoriteListResponse } from "@/features/favorite/types";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { favoriteQueries } from "@/shared/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

export function useFavoriteSectionViewModel() {
  const [selectedCategory, setSelectedCategory] = useQueryState(
    "type",
    parseAsString.withDefault("")
  );
  const [region, setRegion] = useQueryState(
    "region",
    parseAsString.withDefault("")
  );
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("createdAt")
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault("desc")
  );

  const regionFilter =
    BRANCH_OPTIONS.find((r) => r.value === region) ?? BRANCH_OPTIONS[0];

  const handleSortChange = (sort: DagymSort) => {
    setSortBy(sort.sortBy);
    setSortOrder(sort.sortOrder);
  };

  const { toggleFavorite } = useFavorite();

  const { data: categories = [] } = useMeetingTypes();

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery<FavoriteListResponse>({
      queryKey: favoriteQueries.list({
        type: selectedCategory,
        region,
        sortBy,
        sortOrder,
      }),
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("type", selectedCategory);
        if (region) params.set("region", region);
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        params.set("size", "10");
        if (pageParam) params.set("cursor", pageParam as string);
        const res = await fetch(`/api/favorites?${params}`);
        return res.json();
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
    });

  const meetings =
    data?.pages.flatMap((page) => (page.data ?? []).map((f) => f.meeting)) ??
    [];

  const tabs = [
    { id: 0, name: "전체" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  return {
    selectedCategory,
    region,
    sortBy,
    sortOrder,
    regionFilter,
    setSelectedCategory,
    setRegion,
    handleSortChange,
    tabs,
    meetings,
    isLoading,
    isError,
    observerRef,
    toggleFavorite,
  };
}
