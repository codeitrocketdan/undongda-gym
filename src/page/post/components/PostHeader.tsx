"use client";
import headerPost from "@/page/post/assets/images/header_post.svg";
import CreateButton from "@/shared/ui/button/CreateButton";
import SubPageHeader from "@/shared/ui/subPageHeader/SubPageHeader";
import { useUser } from "@/shared/hooks/useUser";
import { LoginModal, useModal } from "@/shared/ui/modal";
import { useRouter } from "next/navigation";

export default function PostHeader() {
  const router = useRouter();
  const { user } = useUser();
  const loginModal = useModal();

  const handleWrite = () => {
    if (!user) {
      loginModal.open();
      return;
    }
    router.push("/post/write");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SubPageHeader
        imageSrc={headerPost}
        title="다짐 토크"
        description="다짐 토크에서 자유롭게 이야기해요 ╰(*°▽°*)╯"
      />
      <div className="hidden shrink-0 md:block">
        <CreateButton onClick={handleWrite}>게시글 등록하기</CreateButton>
      </div>
      {loginModal.isOpen && <LoginModal onClose={loginModal.close} />}
    </div>
  );
}
