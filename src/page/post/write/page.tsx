"use client";

import { useCreatePost } from "@/features/post/model/usePostDetail";
import PostForm, { PostFormData } from "@/features/post/ui/PostForm";
import { useRouter } from "next/navigation";

export default function PostWritePage() {
  const router = useRouter();
  const create = useCreatePost();

  const handleSubmit = (data: PostFormData) => {
    create.mutate(data, { onSuccess: () => router.push("/post") });
  };

  return (
    <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
      <PostForm
        onSubmit={handleSubmit}
        isSubmitting={create.isPending}
      />
    </main>
  );
}
