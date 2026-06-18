"use client";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export const MEETING_CATEGORY_TABS = [
  { id: 1, name: "정규수업" },
  { id: 2, name: "다모여짐" },
] as const;

export type MeetingCategory = "정규수업" | "다모여짐";

export function useMeetingCategoryTab() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["정규수업", "다모여짐"] as const).withDefault(
      "정규수업"
    )
  );
  return { tab, setTab, tabs: MEETING_CATEGORY_TABS };
}
