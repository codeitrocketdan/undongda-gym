"use client";
import { SortOption } from "@/shared/ui/filter/SortFilter";

// Swagger 기준 리뷰 정렬 옵션: createdAt | score | participantCount
const REVIEW_SORT_OPTIONS: SortOption[] = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "오래된순", value: "createdAt:asc" },
  { label: "높은 점수순", value: "score:desc" },
  { label: "낮은 점수순", value: "score:asc" },
  { label: "참여자 많은순", value: "participantCount:desc" },
];

import { BRANCH_OPTIONS } from "@/features/dagym/constants/region";
import { MeetingTypeDTO } from "@/features/dagym/types";
import ReviewCard, {
  ReviewCardSkeleton,
} from "@/features/review/components/ReviewCard";
import { ReviewDTO, ReviewListResponse } from "@/features/review/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import Filter from "@/shared/ui/filter/Filter";
import PillTabs from "@/shared/ui/tab/PillTabs";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { parseAsString, useQueryState } from "nuqs";
import ReviewStats from "./ReviewStats";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 5;

export default function ReviewSection() {
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
    BRANCH_OPTIONS.find((r) => r.value === region) ?? BRANCH_OPTIONS[0];

  const currentSort =
    REVIEW_SORT_OPTIONS.find((o) => o.value === `${sortBy}:${sortOrder}`) ??
    REVIEW_SORT_OPTIONS[0];

  const handleSortChange = (option: SortOption) => {
    const [by, order] = option.value.split(":");
    setSortBy(by);
    setSortOrder(order);
  };

  // 카테고리 목록
  const { data: categories = [] } = useQuery<MeetingTypeDTO[]>({
    queryKey: ["meeting-types"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/meeting-types`);
      return res.json();
    },
  });

  // 리뷰 통계
  const { data: stats } = useQuery({
    queryKey: ["review-stats", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("type", selectedCategory);
      const res = await fetch(`${API_URL}/reviews/statistics?${params}`);
      return res.json();
    },
  });

  // 리뷰 목록 무한스크롤
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery<ReviewListResponse>({
      queryKey: ["reviews", selectedCategory, region, sortBy, sortOrder],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          size: String(LIMIT),
          sortBy,
          sortOrder,
          ...(selectedCategory && { type: selectedCategory }),
          ...(region && { region }),
          ...(pageParam ? { cursor: pageParam as string } : {}),
        });
        const res = await fetch(`${API_URL}/reviews?${params}`);
        return res.json();
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
    });

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  const observerRef = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching });

  const tabs = [
    { id: 0, name: "전체" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  return (
    <section className="mt-8">
      {/* 탭 + 필터 */}
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
            options={BRANCH_OPTIONS}
            value={regionFilter}
            onChange={(option) => setRegion(option.value)}
          />
          <Filter.Sort
            options={REVIEW_SORT_OPTIONS}
            value={currentSort}
            onChange={handleSortChange}
          />
        </div>
      </div>

      {/* 통계 */}
      {stats && (
        <ReviewStats
          averageScore={stats.averageScore}
          totalReviews={stats.totalReviews}
          oneStar={stats.oneStar}
          twoStars={stats.twoStars}
          threeStars={stats.threeStars}
          fourStars={stats.fourStars}
          fiveStars={stats.fiveStars}
        />
      )}

      {/* 리뷰 목록 */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white px-6 py-4 md:gap-8 md:rounded-4xl md:p-8">
        {isLoading ? (
          Array.from({ length: LIMIT }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))
        ) : isError ? (
          // 추후 에러 모달로 변경
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-sm text-slate-400">
              불러오는 중 문제가 발생했어요
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <Image src={emptyImage} alt="리뷰 없음" className="h-50 w-50" />
            <p className="text-center text-sm text-slate-400">
              아직 리뷰가 없어요 <br /> 다짐에 참여하고 첫 리뷰를 남겨보세요!
            </p>
          </div>
        ) : (
          reviews.map((review: ReviewDTO) => (
            <ReviewCard
              key={review.id}
              score={review.score}
              comment={review.comment}
              image={review.meeting.image}
              createdAt={review.createdAt}
              author={{ name: review.user.name, image: review.user.image }}
              meetingId={review.meetingId}
              name={review.meeting.name}
              type={review.meeting.type}
            />
          ))
        )}
      </div>
      <div ref={observerRef} />
    </section>
  );
}
