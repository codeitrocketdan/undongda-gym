"use client";
import {
  MEETING_CATEGORY_TABS,
  MeetingCategory,
  useMeetingCategoryTab,
} from "@/shared/hooks/useMeetingCategoryTab";
import UnderlineTabs from "./UnderlineTabs";

export default function MeetingCategoryTabs() {
  const { tab, setTab } = useMeetingCategoryTab();
  return (
    <div className="mb-6">
      <UnderlineTabs
        tabs={[...MEETING_CATEGORY_TABS]}
        defaultValue={tab}
        onChange={(value) => setTab(value as MeetingCategory)}
      />
    </div>
  );
}
