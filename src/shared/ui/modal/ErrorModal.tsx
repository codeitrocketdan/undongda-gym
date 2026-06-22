"use client";

import Button from "@/shared/ui/button/Button";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
  message?: string;
}

export default function ErrorModal({
  onClose,
  message = "잠시 후 다시 시도해 주세요.",
}: Props) {
  return (
    <Modal onClose={onClose} isClickToClose>
      <Modal.Header className="flex-row justify-end">
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <div className="py-1 text-center">
          <p className="text-2xl font-semibold text-slate-800">
            일시적인 오류가 발생했어요
          </p>
          <p className="mt-2 text-sm text-slate-500">{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}
