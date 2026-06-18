"use client";

import Button from "@/shared/ui/button/Button";
import Modal from "./Modal";

interface ConfirmModalProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "삭제하기",
  cancelLabel = "취소",
  isConfirming = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onClose} isClickToClose>
      <Modal.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <Modal.CloseButton />
        </div>
      </Modal.Header>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <Modal.Footer>
        <Button variant="tertiary" onClick={onClose} isDisabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} isDisabled={isConfirming}>
          {isConfirming ? "처리 중..." : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
