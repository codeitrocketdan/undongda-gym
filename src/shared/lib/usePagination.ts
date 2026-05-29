"use client";

import { useCallback, useMemo, useState } from "react";

interface UsePaginationOptions {
  totalCount: number;
  limit?: number;
  pageSize?: number;
  initialPage?: number;
  onChange?: (page: number) => void;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  pages: number[];
  offset: number;
  limit: number;
  hasPrev: boolean;
  hasNext: boolean;
  goTo: (page: number) => void;
  goPrev: () => void;
  goNext: () => void;
}

export function usePagination({
  totalCount,
  limit = 10,
  pageSize = 5,
  initialPage = 1,
  onChange,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / limit)),
    [totalCount, limit]
  );

  const groupStart = useMemo(
    () => Math.floor((currentPage - 1) / pageSize) * pageSize + 1,
    [currentPage, pageSize]
  );

  const pages = useMemo(
    () =>
      Array.from(
        { length: Math.min(pageSize, totalPages - groupStart + 1) },
        (_, i) => groupStart + i
      ),
    [groupStart, pageSize, totalPages]
  );

  const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

  const goTo = useCallback(
    (page: number) => {
      const next = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(next);
      onChange?.(next);
    },
    [totalPages, onChange]
  );

  const goPrev = useCallback(() => {
    const next = Math.max(1, groupStart - pageSize);
    setCurrentPage(next);
    onChange?.(next);
  }, [groupStart, pageSize, onChange]);

  const goNext = useCallback(() => {
    const next = Math.min(totalPages, groupStart + pageSize);
    setCurrentPage(next);
    onChange?.(next);
  }, [groupStart, pageSize, totalPages, onChange]);

  return {
    currentPage,
    totalPages,
    pages,
    offset,
    limit,
    hasPrev: groupStart > 1,
    hasNext: groupStart + pageSize - 1 < totalPages,
    goTo,
    goPrev,
    goNext,
  };
}
