"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import emptyImage from "@/shared/assets/images/empty.svg";
import { Pagination } from "@/shared/ui/pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Dagym, Review } from "../../model/types";
import ReviewItem from "./ReviewItem";

interface Props {
  dagym: Dagym;
  meetingId: string;
}

interface ApiResponse {
  data: Review[];
  nextCursor: string | null;
  hasMore: boolean;
}

const DagymReviews = ({ dagym, meetingId }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const cursorMapRef = useRef<Record<number, string>>({
    1: "",
  });

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["dagymReviews", meetingId, currentPage],

    queryFn: async () => {
      return clientFetcher.get<ApiResponse>(
        `/api/meetings/${meetingId}/reviews`
      );
    },
  });

  useEffect(() => {
    if (!data?.nextCursor) return;

    cursorMapRef.current[currentPage + 1] = data.nextCursor;
  }, [data, currentPage]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        리뷰를 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-20 text-center text-red-400">
        리뷰를 불러오는데 실패했습니다.
      </div>
    );
  }

  const { data: reviews, hasMore } = data;

  const pages = Array.from(
    { length: currentPage + (hasMore ? 1 : 0) },
    (_, i) => i + 1
  );

  return (
    <section className="mb-20">
      <h2 className="text-2xl-semibold mb-5">리뷰 모아보기</h2>

      <div className="mb-8 rounded-4xl bg-white px-8 py-6">
        {data.data.length !== 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                dagym={dagym}
                rating={review.score}
                content={review.comment}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
            <p className="text-center text-sm text-slate-400">
              아직 작성된 리뷰가 없어요
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={pages.length}
          pages={pages}
          hasPrev={currentPage > 1}
          hasNext={hasMore}
          goTo={(page) => setCurrentPage(page)}
          goPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          goNext={() => setCurrentPage((p) => p + 1)}
        />
      </div>
    </section>
  );
};

export default DagymReviews;
