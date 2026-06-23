"use client";

import DagymCard, {
  DagymCardSkeleton,
} from "@/features/dagym/components/DagymCard";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useUser } from "@/shared/hooks/useUser";
import { ErrorModal, useModal } from "@/shared/ui/modal";
import Image from "next/image";
import { useFavoriteListViewModel } from "../model/useFavoriteListViewModel";

export function FavoriteListSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <DagymCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function FavoriteList() {
  const errorModal = useModal();
  const { user } = useUser();
  const { meetings, observerRef, toggleFavorite, toggleJoin, isEmpty } =
    useFavoriteListViewModel({ userId: user?.id });

  return (
    <>
      {meetings.length === 0 ? (
        isEmpty ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
            <Image
              src={emptyImage}
              alt="찜한 다짐이 없습니다"
              className="h-50 w-50"
            />
            <p className="text-center text-sm text-slate-400">
              아직 찜한 다짐이 없어요 <br /> 마음에 드는 다짐을 찜해보세요!
            </p>
          </div>
        ) : (
          <FavoriteListSkeleton />
        )
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {meetings.map((meeting) => (
            <DagymCard
              key={meeting.id}
              id={meeting.id}
              image={meeting.image}
              isFavorited={true}
              confirmedAt={meeting.confirmedAt}
              canceledAt={meeting.canceledAt}
              isJoined={meeting.isJoined}
              title={meeting.name}
              region={meeting.region}
              address={meeting.address}
              type={meeting.type}
              dateTime={meeting.dateTime}
              registrationEnd={meeting.registrationEnd}
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              onToggleFavorite={() => toggleFavorite(meeting.id, true)}
              onJoin={() => toggleJoin(meeting.id, meeting.isJoined)}
            />
          ))}
        </div>
      )}
      <div ref={observerRef} />
      {errorModal.isOpen && <ErrorModal onClose={errorModal.close} />}
    </>
  );
}
