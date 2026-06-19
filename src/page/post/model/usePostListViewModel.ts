"use client";

import { PostListResponse } from "@/features/post/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { postQueries } from "@/shared/lib/queryKeys";
import { SortOption } from "@/shared/ui/filter/SortFilter";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { useEffect, useState } from "react";

const LIMIT = 5;

export const POST_SORT_OPTIONS: SortOption[] = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "오래된순", value: "createdAt:asc" },
  { label: "조회수순", value: "viewCount:desc" },
  { label: "좋아요순", value: "likeCount:desc" },
  { label: "댓글 많은 순", value: "commentCount:desc" },
];

export function usePostListViewModel({
  onError,
}: { onError?: () => void } = {}) {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(POST_SORT_OPTIONS[0]);

  const [sortBy, sortOrder] = sort.value.split(":");
  const offset = (currentPage - 1) * LIMIT;

  const { data, isLoading, isError } = useQuery<PostListResponse>({
    queryKey: postQueries.list({ search, sort: sort.value, page: currentPage }),
    queryFn: () => {
      const query = qs.stringify(
        {
          offset,
          limit: LIMIT,
          sortBy,
          sortOrder,
          keyword: search || undefined,
        },
        { skipNulls: true }
      );
      return clientFetcher.get<PostListResponse>(`/api/posts?${query}`);
    },
  });

  useEffect(() => {
    if (isError) onError?.();
  }, [isError, onError]);

  const posts = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const handleSearch = () => {
    setSearch(keyword);
    setCurrentPage(1);
  };

  const handleSort = (option: SortOption) => {
    setSort(option);
    setCurrentPage(1);
  };

  return {
    keyword,
    setKeyword,
    sort,
    posts,
    isLoading,
    isError,
    totalPages,
    currentPage,
    pages,
    handleSearch,
    handleSort,
    setCurrentPage,
  };
}
