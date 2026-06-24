"use client";
import Button from "@/shared/ui/button/Button";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
  message: string;
}

export default function CopyModal({ onClose, message }: Props) {
  return (
    <Modal onClose={onClose} isClickToClose size="sm">
      <Modal.Header className="flex-row justify-end">
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <p className="text-xl-semibold py-1 text-center break-keep whitespace-pre-line">
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose} className="w-full">
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
