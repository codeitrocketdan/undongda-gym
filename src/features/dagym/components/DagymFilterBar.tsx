"use client";

import Filter from "@/shared/ui/filter/Filter";
import { SortOption } from "@/shared/ui/filter/SortFilter";
import { useState } from "react";

export type DagymSortBy = "createdAt" | "participantCount" | "registrationEnd" | "dateTime";
export type DagymSortOrder = "asc" | "desc";

export interface DagymSort {
  sortBy: DagymSortBy;
  sortOrder: DagymSortOrder;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "인기순", value: "participantCount:desc" },
  { label: "마감순", value: "registrationEnd:asc" },
  { label: "모임 일정 빠른순", value: "dateTime:asc" },
];

function parseSort(value: string): DagymSort {
  const [sortBy, sortOrder] = value.split(":") as [DagymSortBy, DagymSortOrder];
  return { sortBy, sortOrder };
}

interface DagymFilterBarProps {
  value?: DagymSort;
  onSortChange?: (sort: DagymSort) => void;
}

export default function DagymFilterBar({ value, onSortChange }: DagymFilterBarProps) {
  // value prop이 있으면 URL 파라미터와 동기화, 없으면 내부 state 사용
  const externalOption = value
    ? SORT_OPTIONS.find((o) => o.value === `${value.sortBy}:${value.sortOrder}`) ?? SORT_OPTIONS[0]
    : undefined;

  const [internalSort, setInternalSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const sort = externalOption ?? internalSort;

  const handleSortChange = (option: SortOption) => {
    setInternalSort(option);
    onSortChange?.(parseSort(option.value));
  };

  return (
    <div className="flex items-center justify-end">
      <Filter.Sort options={SORT_OPTIONS} value={sort} onChange={handleSortChange} />
    </div>
  );
}
