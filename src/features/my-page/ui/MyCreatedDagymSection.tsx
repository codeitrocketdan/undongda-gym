"use client";

import { MeetingWithHostDTO } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { CreatedMeetingListResponse } from "@/features/my-page/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { userMeetingQueries } from "@/shared/lib/queryKeys";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import qs from "qs";
import MyPageCard from "./MyPageCard";

const LIMIT = 5;

export default function MyCreatedDagymSection() {
  const { toggleFavorite } = useFavorite();
  // useSuspenseInfiniteQuery: 로딩 중엔 Promise를 던짐(상위 Suspense가 처리), 에러면 Error를 던짐(상위 ErrorBoundary가 처리)
  // → isLoading, isError 분기가 이 컴포넌트에서 사라짐
  const {
    data: meetings,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useSuspenseInfiniteQuery<
    CreatedMeetingListResponse,
    Error,
    MeetingWithHostDTO[]
  >({
    queryKey: userMeetingQueries.created(),
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      const query = qs.stringify({
        type: "created",
        size: LIMIT,
        cursor: (pageParam as string) ?? undefined,
      });
      const res = await fetch(`/api/users/me/meetings?${query}`);
      return res.json();
    },
    getNextPageParam: (lastPage: CreatedMeetingListResponse) =>
      lastPage?.nextCursor ?? undefined,
    initialPageParam: null,
    select: (data) =>
      data.pages.flatMap((p: CreatedMeetingListResponse) => p.data),
  });

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* 빈 상태를 얼리 리턴 대신 렌더링 흐름 안에서 처리 */}
      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
          <p className="text-center text-sm text-slate-400">
            아직 만든 다짐이 없어요
          </p>
        </div>
      ) : (
        meetings.map((meeting: MeetingWithHostDTO) => (
          <MyPageCard
            key={meeting.id}
            variant="created-dagym"
            id={meeting.id}
            image={meeting.image}
            isFavorited={meeting.isFavorited ?? false}
            confirmedAt={meeting.confirmedAt}
            canceledAt={meeting.canceledAt}
            isCompleted={meeting.isCompleted}
            title={meeting.name}
            region={meeting.region}
            dateTime={meeting.dateTime}
            participantCount={meeting.participantCount}
            capacity={meeting.capacity}
            onToggleFavorite={() =>
              toggleFavorite(meeting.id, meeting.isFavorited ?? false)
            }
            onClick={() => {}}
          />
        ))
      )}
      <div ref={observerRef} />
    </div>
  );
}
