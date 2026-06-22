"use client";

import { DagymSort } from "@/features/dagym/components/DagymFilterBar";
import { BRANCH_OPTIONS } from "@/features/dagym/constants/region";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";
import { useMeetingTypeList } from "@/shared/hooks/useMeetingTypeList";
import { SortOption } from "@/shared/ui/filter/SortFilter";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
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
  const typeList = useMeetingTypeList();
  const centerOptions = BRANCH_OPTIONS;

  // 첫 렌더와 "type 파라미터 때문에 탭이 바뀐 경우"를 구분하기 위한 표시
  const isFirstRender = useRef(true);
  const isSyncingTabFromType = useRef(false);

  // 사용자가 직접 탭을 바꿨을 때만 카테고리/지역 필터를 초기화한다.
  // (첫 렌더나 type 파라미터로 인한 자동 탭 변경 때는 초기화하지 않는다)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isSyncingTabFromType.current) {
      isSyncingTabFromType.current = false;
      return;
    }
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
    selectedCategoryValue,
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
