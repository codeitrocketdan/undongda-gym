"use client";

import DagymFilterBar, {
  DagymSortBy,
  DagymSortOrder,
} from "@/features/dagym/components/DagymFilterBar";
import { useDagymFilter } from "@/features/dagym/model/useDagymFilter";
import AsyncBoundary from "@/shared/ui/AsyncBoundary";
import { formatDate } from "@/shared/ui/datePicker/utils";
import Filter from "@/shared/ui/filter/Filter";
import MeetingCategoryTabs from "@/shared/ui/tab/MeetingCategoryTabs";
import PillTabs from "@/shared/ui/tab/PillTabs";
import DagymList, { DagymListSkeleton } from "./DagymList";

function DagymListError() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm text-slate-400">불러오는 중 문제가 발생했어요</p>
    </div>
  );
}

export default function DagymSection() {
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
    handleSortChange,
  } = useDagymFilter();

  return (
    <section className="inner">
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
          <DagymFilterBar
            value={{
              sortBy: sortBy as DagymSortBy,
              sortOrder: sortOrder as DagymSortOrder,
            }}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      <AsyncBoundary
        fallback={<DagymListSkeleton />}
        errorFallback={<DagymListError />}
      >
        <DagymList />
      </AsyncBoundary>
    </section>
  );
}
