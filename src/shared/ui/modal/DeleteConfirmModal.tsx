"use client";

import Button from "@/shared/ui/button/Button";
import Modal from "./Modal";

interface DeleteConfirmModalProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  title,
  description,
  confirmLabel = "삭제하기",
  cancelLabel = "취소",
  isConfirming = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const handleClose = () => {
    if (isConfirming) return;
    onClose();
  };

  return (
    <Modal onClose={handleClose} isClickToClose>
      <Modal.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <Modal.CloseButton />
        </div>
      </Modal.Header>
      {description && (
        <Modal.Body>
          <p className="text-sm text-gray-500">{description}</p>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button variant="tertiary" onClick={handleClose} isDisabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} isDisabled={isConfirming}>
          {isConfirming ? "처리 중..." : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
