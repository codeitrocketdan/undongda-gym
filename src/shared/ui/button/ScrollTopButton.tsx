"use client";

import IconButton from "@/shared/ui/button/IconButton";
import { ArrowUpToLine } from "lucide-react";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // 추후에 게시글 무한스크롤할 때 해당 버튼 호출해서 사용해주세요.
    <IconButton onClick={scrollToTop} size="md">
      <ArrowUpToLine />
    </IconButton>
  );
}
