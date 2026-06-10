"use client";

import {
  MyReviewListResponse,
  UserReviewDTO,
} from "@/features/my-page/types";
import { useUserProfile } from "@/features/my-page/model/useUserProfile";
import ReviewCard, {
  ReviewCardSkeleton,
} from "@/features/review/components/ReviewCard";
import emptyImage from "@/shared/assets/images/empty.svg";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";

const LIMIT = 5;

export default function WrittenReviewList() {
  const { data: profile } = useUserProfile();

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery<MyReviewListResponse>({
      queryKey: ["users/me/reviews"],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          size: String(LIMIT),
          ...(pageParam ? { cursor: pageParam as string } : {}),
        });
        const res = await fetch(`/api/users/me/reviews?${params}`);
        return res.json();
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
    });

  const reviews = data?.pages.flatMap((p) => p.data) ?? [];

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: LIMIT }).map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-slate-400">불러오는 중 문제가 발생했어요</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
        <p className="text-center text-sm text-slate-400">
          작성한 리뷰가 없어요
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 md:gap-8 md:rounded-4xl md:p-6 lg:p-8">
      {reviews.map((review: UserReviewDTO) => (
        <ReviewCard
          key={review.id}
          score={review.score}
          comment={review.comment}
          image={review.meeting.image}
          createdAt={review.createdAt}
          author={{
            name: profile?.name ?? "",
            image: profile?.image ?? null,
          }}
          meetingId={review.meetingId}
          name={review.meeting.name}
          type={review.meeting.type}
        />
      ))}
      <div ref={observerRef} />
    </div>
  );
}
