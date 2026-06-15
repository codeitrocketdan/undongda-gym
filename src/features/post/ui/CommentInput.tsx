"use client";

import avatarImage from "@/shared/assets/images/avatar.svg";
import Button from "@/shared/ui/button/Button";
import Image from "next/image";
import { useState } from "react";

interface CommentInputProps {
  userImage?: string | null;
  onSubmit: (content: string) => void;
}

export default function CommentInput({
  userImage,
  onSubmit,
}: CommentInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
        <Image
          src={userImage ?? avatarImage}
          alt="사용자 이미지"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-white p-0.5 pl-3 focus-within:border-blue-400">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="여기에 댓글을 남겨보세요"
          className="flex-1 bg-transparent px-1 py-2.5 text-sm outline-none"
        />
        <Button
          size="sm"
          className="m-0.5 h-10 w-auto shrink-0"
          onClick={handleSubmit}
        >
          등록
        </Button>
      </div>
    </div>
  );
}
