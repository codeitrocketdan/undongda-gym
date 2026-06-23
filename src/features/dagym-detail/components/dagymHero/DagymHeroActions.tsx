"use client";

import Button from "@/shared/ui/button/Button";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";

import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
// ConfirmModal이나 Modal을 사용해 알림 모달을 띄울 수 있도록 import 확인이 필요합니다.
// 여기서는 기존에 import 구조를 참고하여 ConfirmModal 또는 일반 Modal로 대체할 수 있게 세팅합니다.
import { LoginModal, Modal, useModal } from "@/shared/ui/modal";
import { useState } from "react";
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
  const alertModal = useModal();
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertMessage("링크가 클립보드에 복사되었습니다.");
      alertModal.open();
    } catch (error) {
      setAlertMessage(
        "링크 복사에 실패했습니다. \n주소창의 링크를 복사해주세요."
      );
      alertModal.open();
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

      {alertModal.isOpen && (
        <Modal onClose={alertModal.close}>
          <Modal.Body>
            <p className="text-xl-semibold py-4 text-center break-keep whitespace-pre-line">
              {alertMessage}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={alertModal.close}
              className="w-full"
            >
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
