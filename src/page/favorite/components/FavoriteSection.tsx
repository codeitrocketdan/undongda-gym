"use client";

import DagymCard, {
  DagymCardSkeleton,
} from "@/features/dagym/components/DagymCard";
import DagymFilterBar, {
  DagymSortBy,
  DagymSortOrder,
} from "@/features/dagym/components/DagymFilterBar";
import { BRANCH_OPTIONS } from "@/features/dagym/constants/region";
import emptyImage from "@/shared/assets/images/empty.svg";
import Filter from "@/shared/ui/filter/Filter";
import PillTabs from "@/shared/ui/tab/PillTabs";
import Image from "next/image";
import { useFavoriteSectionViewModel } from "../model/useFavoriteSectionViewModel";

export default function FavoriteSection() {
  const {
    selectedCategory,
    regionFilter,
    sortBy,
    sortOrder,
    tabs,
    meetings,
    isLoading,
    isError,
    observerRef,
    setSelectedCategory,
    setRegion,
    handleSortChange,
    toggleFavorite,
  } = useFavoriteSectionViewModel();

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PillTabs
          tabs={tabs}
          defaultValue="전체"
          onChange={(value) =>
            setSelectedCategory(value === "전체" ? "" : value)
          }
        />
        <div className="flex shrink-0 items-center gap-2">
          <Filter.Center
            options={[{ label: "날짜 전체", value: "" }]}
            value={{ label: "날짜 전체", value: "" }}
            onChange={() => {}}
          />
          <Filter.Center
            options={BRANCH_OPTIONS}
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

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <DagymCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-sm text-slate-400">
            불러오는 중 문제가 발생했어요
          </p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
          <Image
            src={emptyImage}
            alt="찜한 다짐이 없습니다"
            className="h-50 w-50"
          />
          <p className="text-center text-sm text-slate-400">
            아직 찜한 다짐이 없어요 <br /> 마음에 드는 다짐을 찜해보세요!
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {meetings.map((meeting) => (
            <DagymCard
              key={meeting.id}
              id={meeting.id}
              image={meeting.image}
              isFavorited={true}
              confirmedAt={meeting.confirmedAt}
              canceledAt={meeting.canceledAt}
              isJoined={meeting.isJoined}
              title={meeting.name}
              region={meeting.region}
              type={meeting.type}
              dateTime={meeting.dateTime}
              registrationEnd={meeting.registrationEnd}
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              onToggleFavorite={() => toggleFavorite(meeting.id, true)}
              onJoin={() => {}}
            />
          ))}
        </div>
      )}
      <div ref={observerRef} />
    </section>
  );
}
