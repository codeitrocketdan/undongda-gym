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
import { MeetingTypeDTO } from "@/features/dagym/types";
import { FavoriteListResponse } from "@/features/favorite/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import Filter from "@/shared/ui/filter/Filter";
import PillTabs from "@/shared/ui/tab/PillTabs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";

export default function FavoriteSection() {
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
  const observerRef = useRef<HTMLDivElement>(null);

  const regionFilter =
    REGION_OPTIONS.find((r) => r.value === region) ?? REGION_OPTIONS[0];

  const handleSortChange = (sort: DagymSort) => {
    setSortBy(sort.sortBy);
    setSortOrder(sort.sortOrder);
  };

  const { data: categories = [] } = useQuery<MeetingTypeDTO[]>({
    queryKey: ["meeting-types"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting-types`
      );
      return res.json();
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery<FavoriteListResponse>({
      queryKey: ["favorites", selectedCategory, region, sortBy, sortOrder],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("type", selectedCategory);
        if (region) params.set("region", region);
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        params.set("size", "10");
        if (pageParam) params.set("cursor", pageParam as string);
        // TODO: 로그인 구현 후 토큰 교체
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites?${params}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMP_TOKEN ?? ""}`,
            }, // TODO: 로그인 구현 후 쿠키에서 토큰 읽도록 교체
          }
        );
        return res.json();
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: null,
    });

  // page.data가 없을 수 있음 (인증 없을 때 에러 응답 반환)
  const meetings =
    data?.pages.flatMap((page) => (page.data ?? []).map((f) => f.meeting)) ??
    [];
  const tabs = [
    { id: 0, name: "전체" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching)
          fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

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
              title={meeting.name}
              region={meeting.region}
              type={meeting.type}
              dateTime={meeting.dateTime}
              registrationEnd={meeting.registrationEnd}
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              onToggleFavorite={() => {}}
              onJoin={() => {}}
            />
          ))}
        </div>
      )}
      <div ref={observerRef} />
    </section>
  );
}
