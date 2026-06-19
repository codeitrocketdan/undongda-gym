"use client";
import IconButton from "@/shared/ui/button/IconButton";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import HotPostSection from "./components/HotPostSection";
import PostHeader from "./components/PostHeader";
import PostListSection from "./components/PostListSection";

export default function PostPage() {
  const router = useRouter();
  return (
    <>
      <main className="inner mt-8 md:mt-10 lg:mt-12.75">
        <PostHeader />
        <HotPostSection />
        <PostListSection />
      </main>

      {/* 플로팅 버튼 */}
      <div className="fixed right-5 bottom-5 z-10 md:hidden">
        <IconButton
          size="md"
          onClick={() => router.push("/post/write")}
          className="bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          ariaLabel="게시글 등록하기"
        >
          <Plus />
        </IconButton>
      </div>
    </>
  );
}
