"use client";

import Button from "@/shared/ui/button/Button";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Modal onClose={onClose} isClickToClose>
      <Modal.Header className="flex-row justify-end">
        <Modal.CloseButton />
      </Modal.Header>
      <main className="py-1 text-center">
        <p className="text-2xl font-semibold text-slate-800">
          로그인이 필요한 서비스입니다.
        </p>
        <p className="mt-2 text-sm text-slate-500">로그인 후 이용해주세요.</p>
      </main>
      <Modal.Footer>
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleLogin}>로그인하러 가기</Button>
      </Modal.Footer>
    </Modal>
  );
}
