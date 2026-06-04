"use client";
import headerTalk from "@/pages/talk/assets/images/header_talk.svg";
import CreateButton from "@/shared/ui/button/CreateButton";
import SubPageHeader from "@/shared/ui/SubPageHeader/SubPageHeader";

export default function TalkHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SubPageHeader
        imageSrc={headerTalk}
        title="다짐 토크"
        description="다짐 토크에서 자유롭게 이야기해요 ╰(*°▽°*)╯"
      />
      <div className="hidden shrink-0 md:block">
        <CreateButton>게시글 등록하기</CreateButton>
      </div>
    </div>
  );
}
