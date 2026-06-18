"use client";

import {
  COMMUNITY_TYPES,
  REGULAR_CLASS_TYPES,
} from "@/features/dagym/constants/meetingTypes";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";
import { parseAsString, useQueryState } from "nuqs";

export function useListQueryParams() {
  const [selectedCategory] = useQueryState(
    "type",
    parseAsString.withDefault("")
  );
  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const [region] = useQueryState("region", parseAsString.withDefault(""));
  const [sortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("createdAt")
  );
  const [sortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault("desc")
  );

  const { tab } = useMeetingCategoryTab();
  const typeList = tab === "정규수업" ? REGULAR_CLASS_TYPES : COMMUNITY_TYPES;

  return { selectedCategory, date, region, sortBy, sortOrder, typeList };
}
