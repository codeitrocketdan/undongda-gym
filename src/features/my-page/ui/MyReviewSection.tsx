"use client";

import { ReviewCardSkeleton } from "@/features/review/components/ReviewCard";
import AsyncBoundary from "@/shared/ui/AsyncBoundary";
import PillTabs from "@/shared/ui/tab/PillTabs";
import { useState } from "react";
import MyPageCardSkeleton from "./MyPageCardSkeleton";
import WritableReviewList from "./WritableReviewList";
import WrittenReviewList from "./WrittenReviewList";

const SUB_TABS = [
  { id: 0, name: "작성 가능한 리뷰" },
  { id: 1, name: "작성한 리뷰" },
];

const WRITABLE_REVIEW_TAB = SUB_TABS[0].name;
const WRITTEN_REVIEW_TAB = SUB_TABS[1].name;

function ListError() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm text-slate-400">불러오는 중 문제가 발생했어요</p>
    </div>
  );
}

function WritableReviewSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-4 lg:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <MyPageCardSkeleton key={i} />
      ))}
    </div>
  );
}

function WrittenReviewSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function MyReviewSection() {
  const [activeTab, setActiveTab] = useState(SUB_TABS[0].name);

  return (
    <div className="flex flex-col">
      <PillTabs
        tabs={SUB_TABS}
        defaultValue={SUB_TABS[0].name}
        onChange={setActiveTab}
      />
      {activeTab === WRITABLE_REVIEW_TAB && (
        <AsyncBoundary
          fallback={<WritableReviewSkeleton />}
          errorFallback={<ListError />}
        >
          <WritableReviewList />
        </AsyncBoundary>
      )}
      {activeTab === WRITTEN_REVIEW_TAB && (
        <AsyncBoundary
          fallback={<WrittenReviewSkeleton />}
          errorFallback={<ListError />}
        >
          <WrittenReviewList />
        </AsyncBoundary>
      )}
    </div>
  );
}
