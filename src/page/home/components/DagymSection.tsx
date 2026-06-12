"use client";

import DagymCard, {
  DagymCardSkeleton,
} from "@/features/dagym/components/DagymCard";
import DagymFilterBar, {
  DagymSort,
  DagymSortBy,
  DagymSortOrder,
} from "@/features/dagym/components/DagymFilterBar";
import { REGION_OPTIONS } from "@/features/dagym/constants/region";
import { MeetingListResponse, MeetingTypeDTO } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import emptyImage from "@/shared/assets/images/empty.svg";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { meetingQueries } from "@/shared/lib/queryKeys";
import Filter from "@/shared/ui/filter/Filter";
import PillTabs from "@/shared/ui/tab/PillTabs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { createSerializer, parseAsString, useQueryState } from "nuqs";

// null 값은 자동으로 쿼리스트링에서 제외됨
const serialize = createSerializer({
  type: parseAsString,
  region: parseAsString,
  sortBy: parseAsString,
  sortOrder: parseAsString,
  size: parseAsString,
  cursor: parseAsString,
});

export default function DagymSection() {
  const { toggleFavorite } = useFavorite();
  const [selectedCategory, setSelectedCategory] = useQueryState(
    "type",
    parseAsString.withDefault("")
  );
  const [region, setRegion] = useQueryState(
    "region",
    parseAsString.withDefault("")
  );
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("createdAt")
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault("desc")
  );

  const regionFilter =
    REGION_OPTIONS.find((r) => r.value === region) ?? REGION_OPTIONS[0];

  const handleSortChange = (sort: DagymSort) => {
    setSortBy(sort.sortBy);
    setSortOrder(sort.sortOrder);
  };

  // 카테고리 목록 (한 번만 fetch, 캐시 유지)
  const { data: categories = [] } = useQuery<MeetingTypeDTO[]>({
    queryKey: ["meeting-types"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting-types`
      );
      return res.json();
    },
  });

  // 다짐 목록 무한스크롤
  // queryKey에 필터값이 포함되어 있어서 필터 변경 시 자동으로 처음부터 다시 fetch
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery<MeetingListResponse>({
      queryKey: meetingQueries.list({
        type: selectedCategory,
        region,
        sortBy,
        sortOrder,
      }),
      queryFn: async ({ pageParam }) => {
        const query = serialize({
          type: selectedCategory || null,
          region: region || null,
          sortBy,
          sortOrder,
          size: "10",
          cursor: (pageParam as string) || null,
        });
        const res = await fetch(`/api/meetings${query}`);
        return res.json();
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
    });

  // 페이지별로 나뉜 데이터를 하나의 배열로 flatten
  const meetings = data?.pages.flatMap((page) => page.data) ?? [];

  const tabs = [
    { id: 0, name: "전체" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  return (
    <section className="inner">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PillTabs
          tabs={tabs}
          defaultValue="전체"
          onChange={(value) =>
            setSelectedCategory(value === "전체" ? "" : value)
          }
        />
        <div className="flex shrink-0 items-center gap-2">
          {/* 날짜 필터 - 달력 머지 후 연결 예정 */}
          <Filter.Center
            options={[{ label: "날짜 전체", value: "" }]}
            value={{ label: "날짜 전체", value: "" }}
            onChange={() => {}}
          />
          <Filter.Center
            options={REGION_OPTIONS}
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
        // 추후 에러 모달로 변경
        <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-sm text-slate-400">
            불러오는 중 문제가 발생했어요
          </p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
          <Image
            src={emptyImage}
            alt="데이터가 없습니다"
            className="h-50 w-50"
          />
          <p className="text-center text-sm text-slate-400">
            아직 다짐이 없어요 <br /> 지금 바로 다짐을 만들어보세요!
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {meetings.map((meeting) => (
            <DagymCard
              key={meeting.id}
              id={meeting.id}
              image={meeting.image}
              isFavorited={meeting.isFavorited}
              confirmedAt={meeting.confirmedAt}
              title={meeting.name}
              region={meeting.region}
              type={meeting.type}
              dateTime={meeting.dateTime}
              registrationEnd={meeting.registrationEnd}
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              onToggleFavorite={() =>
                toggleFavorite(meeting.id, meeting.isFavorited ?? false)
              }
              onJoin={() => {}}
            />
          ))}
        </div>
      )}
      <div ref={observerRef} />
    </section>
  );
}
