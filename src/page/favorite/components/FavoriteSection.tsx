"use client";

import DagymFilterBar, {
  DagymSortBy,
  DagymSortOrder,
} from "@/features/dagym/components/DagymFilterBar";
import AsyncBoundary from "@/shared/ui/AsyncBoundary";
import { formatDate } from "@/shared/ui/datePicker/utils";
import Filter from "@/shared/ui/filter/Filter";
import MeetingCategoryTabs from "@/shared/ui/tab/MeetingCategoryTabs";
import PillTabs from "@/shared/ui/tab/PillTabs";
import { useDagymFilter } from "@/features/dagym/model/useDagymFilter";
import { useUser } from "@/shared/hooks/useUser";
import { useRouter } from "next/navigation";
import FavoriteList, { FavoriteListSkeleton } from "./FavoriteList";

function FavoriteListError() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm text-slate-400">불러오는 중 문제가 발생했어요</p>
    </div>
  );
}

export default function FavoriteSection() {
  const { user } = useUser();
  const router = useRouter();

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

  if (!user) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-slate-400">
          로그인 후 찜한 다짐을 확인할 수 있어요
        </p>
        <button
          onClick={() => router.push("/login")}
          className="cursor-pointer text-sm font-semibold text-blue-500 underline"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

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
        fallback={<FavoriteListSkeleton />}
        errorFallback={<FavoriteListError />}
      >
        <FavoriteList />
      </AsyncBoundary>
    </section>
  );
}
