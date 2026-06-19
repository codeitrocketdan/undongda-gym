"use client";

import ReviewCard, {
  ReviewCardSkeleton,
} from "@/features/review/components/ReviewCard";
import ReviewModal from "@/features/review/components/ReviewModal";
import { ReviewDTO } from "@/features/review/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useModal } from "@/shared/ui/modal";
import Image from "next/image";
import { useState } from "react";
import { useReviewListViewModel } from "../model/useReviewListViewModel";

export function ReviewListSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white px-6 py-4 md:gap-8 md:rounded-4xl md:p-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ReviewList() {
  const detailModal = useModal();
  const [selectedReview, setSelectedReview] = useState<ReviewDTO | null>(null);
  const { reviews, observerRef } = useReviewListViewModel();

  return (
    <>
      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white px-6 py-4 md:gap-8 md:rounded-4xl md:p-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <Image src={emptyImage} alt="리뷰 없음" className="h-50 w-50" />
            <p className="text-center text-sm text-slate-400">
              아직 리뷰가 없어요 <br /> 다짐에 참여하고 첫 리뷰를 남겨보세요!
            </p>
          </div>
        ) : (
          reviews.map((review: ReviewDTO) => (
            <button
              key={review.id}
              onClick={() => {
                setSelectedReview(review);
                detailModal.open();
              }}
              className="cursor-pointer text-left transition-opacity hover:opacity-75"
            >
              <ReviewCard
                score={review.score}
                comment={review.comment}
                image={review.meeting.image}
                createdAt={review.createdAt}
                author={{ name: review.user.name, image: review.user.image }}
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
