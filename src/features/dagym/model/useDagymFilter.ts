"use client";

import { DagymSort } from "@/features/dagym/components/DagymFilterBar";
import {
  COMMUNITY_TYPES,
  REGULAR_CLASS_TYPES,
} from "@/features/dagym/constants/meetingTypes";
import { BRANCH_OPTIONS } from "@/features/dagym/constants/region";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";
import { SortOption } from "@/shared/ui/filter/SortFilter";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useMeetingTypes } from "./useMeetingTypes";

export function useDagymFilter() {
  const [selectedCategoryValue, setSelectedCategory] = useQueryState(
    "type",
    parseAsString.withDefault("")
  );
  const [date, setDate] = useQueryState("date", parseAsString.withDefault(""));
  const [regionValue, setRegion] = useQueryState(
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

  const { tab } = useMeetingCategoryTab();
  const typeList = tab === "정규수업" ? REGULAR_CLASS_TYPES : COMMUNITY_TYPES;
  const centerOptions = BRANCH_OPTIONS;

  // 탭이 바뀔 때만 카테고리/지역 필터를 초기화한다 (selectedCategoryValue, regionValue를
  // deps에 넣으면 필터 값이 바뀔 때도 effect가 재실행되어 의도가 깨진다)
  useEffect(() => {
    if (selectedCategoryValue) setSelectedCategory(null);
    if (regionValue) setRegion(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const regionFilter =
    centerOptions.find((r) => r.value === regionValue) ?? centerOptions[0];

  const handleSortChange = (sort: DagymSort) => {
    setSortBy(sort.sortBy);
    setSortOrder(sort.sortOrder);
  };

  const handleSortOptionChange = (option: SortOption) => {
    const [by, order] = option.value.split(":");
    setSortBy(by);
    setSortOrder(order);
  };

  const { data: categories = [] } = useMeetingTypes();
  const tabs = [
    { id: 0, name: "전체" },
    ...categories
      .filter((c) => typeList.includes(c.name))
      .map((c) => ({ id: c.id, name: c.name })),
  ];

  return {
    tab,
    tabs,
    date,
    centerOptions,
    regionFilter,
    sortBy,
    sortOrder,
    setSelectedCategory,
    setDate,
    setRegion,
    handleSortChange,
    handleSortOptionChange,
  };
}
