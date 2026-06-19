"use client";

import { MeetingWithHostDTO } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { CreatedMeetingListResponse } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { userMeetingQueries } from "@/shared/lib/queryKeys";
import Image from "next/image";
import MyPageCard from "./MyPageCard";

const LIMIT = 5;

export default function MyCreatedDagymSection() {
  const { toggleFavorite } = useFavorite();

  const { items: meetings, observerRef } = useSuspenseInfiniteList({
    queryKey: userMeetingQueries.created(),
    queryFn: (pageParam) =>
      clientFetcher.get<CreatedMeetingListResponse>(
        `/api/users/me/meetings?type=created&size=${LIMIT}${pageParam ? `&cursor=${pageParam}` : ""}`
      ),
  });

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
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
            address={meeting.address}
            dateTime={meeting.dateTime}
            registrationEnd={meeting.registrationEnd}
            participantCount={meeting.participantCount}
            capacity={meeting.capacity}
            onToggleFavorite={() =>
              toggleFavorite(meeting.id, meeting.isFavorited ?? false)
            }
          />
        ))
      )}
      <div ref={observerRef} />
    </div>
  );
}
