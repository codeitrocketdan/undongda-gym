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
import { useEffect, useState } from "react";
import MyPageCard from "./MyPageCard";
import MyPageCardSkeleton from "./MyPageCardSkeleton";

const LIMIT = 5;

export default function MyDagymSection() {
  const { toggleFavorite } = useFavorite();
  const { toggleJoin } = useJoinMeeting();
  const { user } = useUser();
  // useUser는 suspense 쿼리가 아니라 SSR에서 항상 user가 undefined로 렌더링된다.
  // 마운트 전까지는 서버와 동일하게 "내 다짐 아님"으로 둬서 하이드레이션 불일치를 막는다.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const {
    items: meetings,
    observerRef,
    hasNextPage,
    isFetching,
  } = useSuspenseInfiniteList({
    queryKey: [...userMeetingQueries.all, "all"],
    queryFn: (pageParam) =>
      clientFetcher.get<MyMeetingListResponse>(
        `/api/users/me/meetings?size=${LIMIT}${pageParam ? `&cursor=${pageParam}` : ""}`
      ),
  });

  const isEmpty = meetings.length === 0 && !hasNextPage && !isFetching;

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {meetings.length === 0 ? (
        isEmpty ? (
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
          Array.from({ length: 3 }).map((_, i) => (
            <MyPageCardSkeleton key={i} />
          ))
        )
      ) : (
        meetings.map((meeting: MeetingWithHostDTO) => {
          const isOwner = mounted && meeting.host.id === user?.id;
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
