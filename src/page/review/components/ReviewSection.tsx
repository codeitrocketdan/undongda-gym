"use client";

import { useDagymFilter } from "@/features/dagym/model/useDagymFilter";
import AsyncBoundary from "@/shared/ui/AsyncBoundary";
import { formatDate } from "@/shared/ui/datePicker/utils";
import Filter from "@/shared/ui/filter/Filter";
import { SortOption } from "@/shared/ui/filter/SortFilter";
import MeetingCategoryTabs from "@/shared/ui/tab/MeetingCategoryTabs";
import PillTabs from "@/shared/ui/tab/PillTabs";
import { useReviewStatsViewModel } from "../model/useReviewStatsViewModel";
import ReviewList, { ReviewListSkeleton } from "./ReviewList";
import ReviewStats from "./ReviewStats";

const REVIEW_SORT_OPTIONS: SortOption[] = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "오래된순", value: "createdAt:asc" },
  { label: "높은 점수순", value: "score:desc" },
  { label: "낮은 점수순", value: "score:asc" },
  { label: "참여자 많은순", value: "participantCount:desc" },
];

function ReviewListError() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm text-slate-400">불러오는 중 문제가 발생했어요</p>
    </div>
  );
}

function ReviewStatsWrapper() {
  const { stats } = useReviewStatsViewModel();
  return (
    <ReviewStats
      averageScore={stats.averageScore}
      totalReviews={stats.totalReviews}
      oneStar={stats.oneStar}
      twoStars={stats.twoStars}
      threeStars={stats.threeStars}
      fourStars={stats.fourStars}
      fiveStars={stats.fiveStars}
    />
  );
}

export default function ReviewSection() {
  const {
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
    handleSortOptionChange,
  } = useDagymFilter();

  const currentSort =
    REVIEW_SORT_OPTIONS.find((o) => o.value === `${sortBy}:${sortOrder}`) ??
    REVIEW_SORT_OPTIONS[0];

  return (
    <section className="mt-8">
      <MeetingCategoryTabs />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PillTabs
          key={tab}
          tabs={tabs}
          defaultValue="전체"
          onChange={(value) =>
            setSelectedCategory(value === "전체" ? "" : value)
          }
        />
        <div className="flex shrink-0 items-center gap-2">
          <Filter.Date
            value={date ? new Date(date) : undefined}
            onChange={(d) => setDate(d ? formatDate(d) : "")}
          />
          <Filter.Center
            options={centerOptions}
            value={regionFilter}
            onChange={(option) => setRegion(option.value)}
          />
          <Filter.Sort
            options={REVIEW_SORT_OPTIONS}
            value={currentSort}
            onChange={handleSortOptionChange}
          />
        </div>
      </div>

      <AsyncBoundary fallback={null} errorFallback={null}>
        <ReviewStatsWrapper />
      </AsyncBoundary>

      <AsyncBoundary
        fallback={<ReviewListSkeleton />}
        errorFallback={<ReviewListError />}
      >
        <ReviewList />
      </AsyncBoundary>
    </section>
  );
}
