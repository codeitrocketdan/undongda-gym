"use client";

import { MyReviewListResponse, UserReviewDTO } from "@/features/my-page/types";
import { useUser } from "@/shared/hooks/useUser";
import ReviewCard from "@/features/review/components/ReviewCard";
import ReviewModal from "@/features/review/components/ReviewModal";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useModal } from "@/shared/ui/modal";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { userReviewQueries } from "@/shared/lib/queryKeys";
import Image from "next/image";
import { useState } from "react";

const LIMIT = 5;

export default function WrittenReviewList() {
  const { user: profile } = useUser();
  const detailModal = useModal();
  const [selectedReview, setSelectedReview] = useState<UserReviewDTO | null>(null);

  const { items: reviews, observerRef } = useSuspenseInfiniteList({
    queryKey: userReviewQueries.all,
    queryFn: (pageParam) =>
      clientFetcher.get<MyReviewListResponse>(
        `/api/users/me/reviews?size=${LIMIT}${pageParam ? `&cursor=${pageParam}` : ""}`
      ),
  });

  return (
    <>
      <div className="mt-4 flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 md:gap-8 md:rounded-4xl md:p-6 lg:p-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
            <p className="text-center text-sm text-slate-400">작성한 리뷰가 없어요</p>
          </div>
        ) : (
          reviews.map((review: UserReviewDTO) => (
            <button
              key={review.id}
              onClick={() => {
                setSelectedReview(review);
                detailModal.open();
              }}
              className="cursor-pointer text-left hover:opacity-75 transition-opacity"
            >
              <ReviewCard
                score={review.score}
                comment={review.comment}
                image={review.meeting.image}
                createdAt={review.createdAt}
                author={{
                  name: profile?.name ?? "",
                  image: profile?.image ?? null,
                }}
                name={review.meeting.name}
                type={review.meeting.type}
              />
            </button>
          ))
        )}
        <div ref={observerRef} />
      </div>
      {detailModal.isOpen && selectedReview && (
        <ReviewModal
          mode="detail"
          review={selectedReview}
          onClose={detailModal.close}
        />
      )}
    </>
  );
}
