"use client";

import { useJoinMeeting } from "@/features/dagym/model/useJoinMeeting";
import { MeetingWithHostDTO } from "@/features/dagym/types";
import { useFavorite } from "@/features/favorite/model/useFavorite";
import { MyMeetingListResponse } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useSuspenseInfiniteList } from "@/shared/hooks/useSuspenseInfiniteList";
import { useUser } from "@/shared/hooks/useUser";
import { userMeetingQueries } from "@/shared/lib/queryKeys";
import Button from "@/shared/ui/button/Button";
import Image from "next/image";
import Link from "next/link";
import MyPageCard from "./MyPageCard";

const LIMIT = 5;

export default function MyDagymSection() {
  const { toggleFavorite } = useFavorite();
  const { toggleJoin } = useJoinMeeting();
  const { user } = useUser();

  const { items: meetings, observerRef } = useSuspenseInfiniteList({
    queryKey: [...userMeetingQueries.all, "all"],
    queryFn: (pageParam) =>
      clientFetcher.get<MyMeetingListResponse>(
        `/api/users/me/meetings?size=${LIMIT}${pageParam ? `&cursor=${pageParam}` : ""}`
      ),
  });

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Image src={emptyImage} alt="빈 목록" className="h-50 w-50" />
          <p className="text-center text-sm text-slate-400">
            참여한 다짐이 없어요 <br /> 다양한 다짐에 참여해보세요!
          </p>
          <Link href="/dagym">
            <Button variant="primary" size="sm">
              다짐 보기
            </Button>
          </Link>
        </div>
      ) : (
        meetings.map((meeting: MeetingWithHostDTO) => {
          const isOwner = meeting.host.id === user?.id;
          return (
            <MyPageCard
              key={meeting.id}
              variant={isOwner ? "created-dagym" : "my-dagym"}
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
              onClick={() => toggleJoin(meeting.id, meeting.isJoined)}
            />
          );
        })
      )}
      <div ref={observerRef} />
    </div>
  );
}
