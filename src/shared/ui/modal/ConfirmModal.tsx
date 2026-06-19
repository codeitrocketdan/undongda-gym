"use client";
import Button from "@/shared/ui/button/Button";
import Modal from "./Modal";

interface Props {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal onClose={onCancel} isClickToClose>
      <Modal.Header className="flex-row justify-end">
        <Modal.CloseButton />
      </Modal.Header>
      <main className="py-1 text-center">
        <p className="text-2xl font-semibold text-slate-800">{title}</p>
        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}
      </main>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
