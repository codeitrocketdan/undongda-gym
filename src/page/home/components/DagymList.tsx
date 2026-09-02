"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import DagymCard, {
  DagymCardSkeleton,
} from "@/features/dagym/components/DagymCard";
import emptyImage from "@/shared/assets/images/empty.svg";
import { useUser } from "@/shared/hooks/useUser";
import { ErrorModal, useModal } from "@/shared/ui/modal";
import { useDagymListViewModel } from "../model/useDagymListViewModel";

const LoginModal = dynamic(() => import("@/shared/ui/modal/LoginModal"), {
  ssr: false,
});

export function DagymListSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <DagymCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function DagymList() {
  const errorModal = useModal();
  const { meetings, observerRef, toggleFavorite, toggleJoin, isEmpty } =
    useDagymListViewModel();
  const { user } = useUser();
  const loginModal = useModal();

  const requireLogin = (action: () => void) => {
    if (!user) {
      loginModal.open();
      return;
    }
    action();
  };

  return (
    <>
      {meetings.length === 0 ? (
        isEmpty ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 py-20">
            <Image
              src={emptyImage}
              alt="데이터가 없습니다"
              className="h-50 w-50"
            />
            <p className="text-center text-sm text-slate-400">
              아직 다짐이 없어요 <br /> 지금 바로 다짐을 만들어보세요!
            </p>
          </div>
        ) : (
          <DagymListSkeleton />
        )
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {meetings.map((meeting) => (
            <DagymCard
              key={meeting.id}
              id={meeting.id}
              isOwner={meeting.host.id === user?.id}
              image={meeting.image}
              isFavorited={meeting.isFavorited}
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
              onToggleFavorite={() =>
                requireLogin(() =>
                  toggleFavorite(meeting.id, meeting.isFavorited ?? false)
                )
              }
              onJoin={() =>
                requireLogin(() => toggleJoin(meeting.id, meeting.isJoined))
              }
            />
          ))}
        </div>
      )}
      <div ref={observerRef} />
      {loginModal.isOpen && <LoginModal onClose={loginModal.close} />}
      {errorModal.isOpen && <ErrorModal onClose={errorModal.close} />}
    </>
  );
}
