"use client";

import Button from "@/shared/ui/button/Button";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";

import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { LoginModal } from "@/shared/ui/modal";
import { useFavoriteMutation } from "../../api/useFavoriteMutation";
import { useJoinMutation } from "../../api/useJoinMutation";

interface Props {
  id: string;
  isFavorited: boolean;
  isJoined: boolean;
  isHost: boolean;
  participantCount: number;
  capacity: number;
  registrationEnd: string;
}

export default function DagymHeroActions({
  id,
  isFavorited,
  isJoined,
  isHost,
  participantCount,
  capacity,
  registrationEnd,
}: Props) {
  const { requireAuth, loginModal } = useRequireAuth();
  const { mutate: joinMutate, isPending: joinPending } = useJoinMutation(id);
  const { mutate: favoriteMutate } = useFavoriteMutation(id);

  const isFull = participantCount >= capacity;
  const isRegistrationClosed =
    registrationEnd && new Date(registrationEnd) < new Date();

  const handleJoinToggle = () => {
    requireAuth(() => joinMutate(isJoined));
  };

  const handleFavoriteToggle = () => {
    requireAuth(() => favoriteMutate(isFavorited));
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    } catch (error) {
      alert("링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.");
    }
  };

  const renderActionButton = () => {
    if (isHost) {
      if (isRegistrationClosed) {
        return (
          <Button variant="primary" isDisabled>
            모집 마감
          </Button>
        );
      }
      return (
        <Button variant="secondary" onClick={handleShare}>
          공유하기
        </Button>
      );
    }

    if (isJoined) {
      if (isRegistrationClosed) {
        return (
          <Button variant="primary" isDisabled>
            모집 마감
          </Button>
        );
      }
      return (
        <Button
          variant="secondary"
          onClick={handleJoinToggle}
          isDisabled={joinPending}
        >
          참여 취소하기
        </Button>
      );
    }

    if (isRegistrationClosed) {
      return (
        <Button variant="primary" isDisabled>
          모집 마감
        </Button>
      );
    }
    if (isFull) {
      return (
        <Button variant="primary" isDisabled>
          정원 마감
        </Button>
      );
    }

    return (
      <Button
        variant="primary"
        onClick={handleJoinToggle}
        isDisabled={joinPending}
      >
        참여하기
      </Button>
    );
  };

  return (
    <div className="flex items-center gap-4">
      <HeartButton
        className="shrink-0"
        isFavorited={isFavorited}
        onClick={handleFavoriteToggle}
      />
      {renderActionButton()}
      {loginModal.isOpen && <LoginModal onClose={loginModal.close} />}
    </div>
  );
}
