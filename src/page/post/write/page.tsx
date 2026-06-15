"use client";

import PostForm, { PostFormData } from "@/features/post/ui/PostForm";

export default function PostWritePage() {
  const handleSubmit = (data: PostFormData) => {
    // TODO: 게시글 작성 API 연동
    console.log(data);
  };

  return (
    <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
      <PostForm onSubmit={handleSubmit} />
    </main>
  );
}
