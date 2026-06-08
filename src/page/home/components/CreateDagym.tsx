"use client";
import { CreateDagymForm } from "@/features/create-dagym";
import CreateButton from "@/shared/ui/button/CreateButton";
import { useModal } from "@/shared/ui/modal/useModal";
export default function CreateDagym({ isLogin }: { isLogin: boolean }) {
  const modal = useModal();
  const handleOpenModal = () => {
    console.log("isLogin", isLogin);
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    modal.open();
  };
  return (
    <>
      <CreateButton onClick={handleOpenModal}>모임 만들기</CreateButton>;
      {modal.isOpen && <CreateDagymForm onClose={modal.close} />}
    </>
  );
}
