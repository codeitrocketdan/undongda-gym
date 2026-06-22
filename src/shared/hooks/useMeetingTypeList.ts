"use client";

import { useMeetingTypes } from "@/features/dagym/model/useMeetingTypes";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";
import { parseMeetingTypeDescription } from "@/shared/lib/meetingTypeDescription";

// 현재 탭(정규수업/다모여짐)에 해당하는 모임 타입 이름 목록
export function useMeetingTypeList() {
  const { tab } = useMeetingCategoryTab();
  const { data: types = [] } = useMeetingTypes();
  const category = tab === "정규수업" ? "regular" : "community";

  return types
    .filter(
      (type) => parseMeetingTypeDescription(type.description).category === category
    )
    .map((type) => type.name);
}
