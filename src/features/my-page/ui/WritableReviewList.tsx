"use client";

import { JoinedMeetingDTO, MyMeetingListResponse } from "@/features/my-page/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import ReviewModal from "@/features/review/components/ReviewModal";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useModal } from "@/shared/ui/modal";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { useUser } from "@/shared/hooks/useUser";
import { userMeetingQueries } from "@/shared/lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import MyPageCard from "./MyPageCard";
import MyPageCardSkeleton from "./MyPageCardSkeleton";

const LIMIT = 5;

export default function WritableReviewList() {
  const { toggleFavorite } = useFavorite();
  const { user } = useUser();
  const reviewModal = useModal();
  const [selectedMeeting, setSelectedMeeting] = useState<JoinedMeetingDTO | null>(null);
  const queryClient = useQueryClient();

  const {
    items: allMeetings,
    observerRef,
    hasNextPage,
    isFetching,
  } = useSuspenseInfiniteList({
    queryKey: userMeetingQueries.writable(),
    queryFn: (pageParam) =>
      clientFetcher.get<MyMeetingListResponse>(
        `/api/users/me/meetings?type=joined&completed=true&reviewed=false&size=${LIMIT}${pageParam ? `&cursor=${pageParam}` : ""}`
      ),
  });

  const meetings = allMeetings.filter((m) => m.host.id !== user?.id);
  const isEmpty = meetings.length === 0 && !hasNextPage && !isFetching;

  return (
    <>
      <div className="mt-4 flex flex-col gap-4 lg:gap-6">
        {meetings.length === 0 ? (
          isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
              <p className="text-center text-sm text-slate-400">
                작성 가능한 리뷰가 없어요
              </p>
            </div>
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <MyPageCardSkeleton key={i} />
            ))
          )
        ) : (
          meetings.map((meeting: JoinedMeetingDTO) => (
            <MyPageCard
              key={meeting.id}
              variant="my-review"
              id={meeting.id}
              image={meeting.image}
              isFavorited={meeting.isFavorited ?? false}
              confirmedAt={meeting.confirmedAt}
              canceledAt={meeting.canceledAt}
              isCompleted={meeting.isCompleted}
              title={meeting.name}
              region={meeting.region}
              address={meeting.address}
              dateTime={meeting.dateTime}
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              onToggleFavorite={() =>
                toggleFavorite(meeting.id, meeting.isFavorited ?? false)
              }
              onClick={() => {
                setSelectedMeeting(meeting);
                reviewModal.open();
              }}
            />
          ))
        )}
        <div ref={observerRef} />
      </div>
      {reviewModal.isOpen && selectedMeeting && (
        <ReviewModal
          mode="write"
          meetingId={selectedMeeting.id}
          onClose={reviewModal.close}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: userMeetingQueries.writable() })
          }
        />
      )}
    </>
  );
}
