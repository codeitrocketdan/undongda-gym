"use client";

import {
  COMMUNITY_TYPES,
  REGULAR_CLASS_TYPES,
} from "@/features/dagym/constants/meetingTypes";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";

export function useMeetingTypeList() {
  const { tab } = useMeetingCategoryTab();
  return tab === "정규수업" ? REGULAR_CLASS_TYPES : COMMUNITY_TYPES;
}
