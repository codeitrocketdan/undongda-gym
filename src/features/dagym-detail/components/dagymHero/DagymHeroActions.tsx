"use client";

import Button from "@/shared/ui/button/Button";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";

import { useFavoriteMutation } from "../../api/useFavoriteMutation";
import { useJoinMutation } from "../../api/useJoinMutation";

interface Props {
  id: string;
  isFavorited: boolean;
  isJoined: boolean;
  isHost: boolean;
  participantCount: number;
  capacity: number;
}

export default function DagymHeroActions({
  id,
  isFavorited,
  isJoined,
  isHost,
  participantCount,
  capacity,
}: Props) {
  const { mutate: joinMutate, isPending: joinPending } = useJoinMutation(id);
  const { mutate: favoriteMutate } = useFavoriteMutation(id);

  const isFull = participantCount >= capacity;

  const handleJoinToggle = () => joinMutate(isJoined);
  const handleFavoriteToggle = () => favoriteMutate(isFavorited);

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("링크가 클립보드에 복사되었습니다.");
    } catch (error) {
      alert("링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <HeartButton
        className="shrink-0"
        isFavorited={isFavorited}
        onClick={handleFavoriteToggle}
      />

      {isHost && !isFull && (
        <Button variant="secondary" onClick={handleShare}>
          공유하기
        </Button>
      )}

      {isHost && isFull && (
        <Button variant="primary" isDisabled>
          모집 마감
        </Button>
      )}

      {!isHost && !isJoined && !isFull && (
        <Button
          variant="primary"
          onClick={handleJoinToggle}
          isDisabled={joinPending}
        >
          참여하기
        </Button>
      )}

      {!isHost && !isJoined && isFull && (
        <Button variant="primary" isDisabled>
          모집 마감
        </Button>
      )}

      {!isHost && isJoined && (
        <Button
          variant="secondary"
          onClick={handleJoinToggle}
          isDisabled={joinPending}
        >
          참여 취소하기
        </Button>
      )}
    </div>
  );
}
