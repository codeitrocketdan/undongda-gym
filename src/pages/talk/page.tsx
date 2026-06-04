"use client";
import IconButton from "@/shared/ui/button/IconButton";
import { Plus } from "lucide-react";
import HotPostSection from "./components/HotPostSection";
import PostListSection from "./components/PostListSection";
import TalkHeader from "./components/TalkHeader";

export default function TalkPage() {
  return (
    <>
      <main className="inner mt-8 md:mt-10 lg:mt-12.75">
        <TalkHeader />
        <HotPostSection />
        <PostListSection />
      </main>

      {/* 플로팅 버튼 */}
      <div className="fixed right-5 bottom-5 z-10 md:hidden">
        <IconButton
          size="md"
          onClick={() => {}}
          className="bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          ariaLabel="게시글 등록하기"
        >
          <Plus />
        </IconButton>
      </div>
    </>
  );
}
