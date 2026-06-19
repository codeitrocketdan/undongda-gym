"use client";

import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";

type CursorPage<T> = { data: T[]; nextCursor?: string | null };

export function useSuspenseInfiniteList<T>({
  queryKey,
  queryFn,
}: {
  queryKey: readonly unknown[];
  queryFn: (pageParam: unknown) => Promise<CursorPage<T>>;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching, isError } =
    useSuspenseInfiniteQuery<
      CursorPage<T>,
      Error,
      InfiniteData<CursorPage<T>>,
      readonly unknown[],
      unknown
    >({
      queryKey,
      queryFn: ({ pageParam }) => queryFn(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: null,
    });

  const items = data.pages.flatMap((page) => page.data);
  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  return { items, observerRef, isError };
}
