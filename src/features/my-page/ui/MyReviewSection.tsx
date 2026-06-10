"use client";

import PillTabs from "@/shared/ui/tab/PillTabs";
import { useState } from "react";
import WritableReviewList from "./WritableReviewList";
import WrittenReviewList from "./WrittenReviewList";

const SUB_TABS = [
  { id: 0, name: "작성 가능한 리뷰" },
  { id: 1, name: "작성한 리뷰" },
];

export default function MyReviewSection() {
  const [activeTab, setActiveTab] = useState(SUB_TABS[0].name);

  return (
    <div className="flex flex-col">
      <PillTabs
        tabs={SUB_TABS}
        defaultValue={SUB_TABS[0].name}
        onChange={setActiveTab}
      />
      {activeTab === "작성 가능한 리뷰" && <WritableReviewList />}
      {activeTab === "작성한 리뷰" && <WrittenReviewList />}
    </div>
  );
}
