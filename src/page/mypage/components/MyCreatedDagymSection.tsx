"use client";

import { MeetingWithHostDTO } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import MyPageCard from "@/features/my-page/MyPageCard";
import { CreatedMeetingListResponse } from "@/features/my-page/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import MyPageCardSkeleton from "./MyPageCardSkeleton";

const LIMIT = 5;

export default function MyCreatedDagymSection() {
  const { toggleFavorite } = useFavorite();
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery<CreatedMeetingListResponse>({
      queryKey: ["users/me/meetings/created"],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          type: "created",
          size: String(LIMIT),
          ...(pageParam ? { cursor: pageParam as string } : {}),
        });
        const res = await fetch(`/api/users/me/meetings?${params}`);
        return res.json();
      },
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      initialPageParam: null,
    });

  const meetings = data?.pages.flatMap((p) => p.data) ?? [];

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 lg:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <MyPageCardSkeleton key={i} />
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

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
        <p className="text-center text-sm text-slate-400">
          아직 만든 다짐이 없어요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {meetings.map((meeting: MeetingWithHostDTO) => (
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
      ))}
      <div ref={observerRef} />
    </div>
  );
}
