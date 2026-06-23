"use client";
import { CreateDagymForm } from "@/features/create-dagym";
import { useMeetingCategoryTab } from "@/shared/hooks/useMeetingCategoryTab";
import CreateButton from "@/shared/ui/button/CreateButton";
import { LoginModal, useModal } from "@/shared/ui/modal";

export default function CreateDagym({ isLogin }: { isLogin: boolean }) {
  const modal = useModal();
  const loginModal = useModal();
  const { tab } = useMeetingCategoryTab();

  const canCreate = tab === "다모여짐";
  if (!canCreate) return null;

  const handleOpenModal = () => {
    if (!isLogin) {
      loginModal.open();
      return;
    }
    modal.open();
  };

  return (
    <>
      <CreateButton onClick={handleOpenModal}>다짐 만들기</CreateButton>
      {modal.isOpen && <CreateDagymForm onClose={modal.close} />}
      {loginModal.isOpen && <LoginModal onClose={loginModal.close} />}
    </>
  );
}
