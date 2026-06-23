"use client";

import { ReviewDTO, ReviewListResponse } from "@/features/review/types";
import { useInView } from "@/shared/hooks/useInView";
import Author from "@/shared/ui/author/Author";
import Rating from "@/shared/ui/rating/Rating";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LandingReviews() {
  const { ref, isInView } = useInView();

  const { data } = useQuery<ReviewListResponse>({
    queryKey: ["reviews", "landing-preview"],
    queryFn: async () => {
      const params = new URLSearchParams({
        size: "50",
      });
      const res = await fetch(`${API_URL}/reviews?${params}`);
      if (!res.ok) return { data: [] };
      return res.json();
    },
  });

  const reviews = data?.data ?? [];
  // 무한 반복 효과를 위해 배열 복제
  const duplicatedReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  if (reviews.length === 0) return null;

  return (
    <div
      ref={ref}
      className={`mx-auto max-w-7xl px-6 py-20 md:py-26 ${
        isInView ? "animate-fadeInUp" : "opacity-0"
      }`}
    >
      <div className="mb-13 text-center">
        <span className="text-sm-bold mb-3 inline-block text-blue-700">
          생생 후기
        </span>
        <h2 className="text-2xl-bold md:text-3xl-bold mb-3 text-gray-900">
          함께한 사람들의 생생한 후기를 만나보세요
        </h2>
        <p className="text-base-regular md:text-lg-regular text-gray-600">
          운동다짐과 함께 습관을 만든 분들의 이야기예요.
        </p>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .carousel-container {
          animation: scroll 80s linear infinite;
        }
        .carousel-container:hover {
          animation-play-state: paused;
        }
        .carousel-wrapper {
          mask-image: linear-gradient(90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%);
        }
      `}</style>

      <div className="carousel-wrapper flex justify-center gap-5 overflow-hidden">
        <div className="carousel-container flex shrink-0 gap-5">
          {duplicatedReviews.map((review: ReviewDTO, index: number) => (
            <div
              key={`${review.id}-${index}`}
              className="flex w-85 shrink-0 flex-col items-center justify-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <Rating score={review.score} size={16} />
              <Author name={review.user.name} image={review.user.image} />
              <p className="text-sm-regular line-clamp-3 text-gray-600">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
