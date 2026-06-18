"use client";

import {
  usePostDetail,
  useUpdatePost,
} from "@/features/post/model/usePostDetail";
import PostForm, { PostFormData } from "@/features/post/ui/PostForm";
import { ErrorModal, useModal } from "@/shared/ui/modal";
import { useParams, useRouter } from "next/navigation";

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const errorModal = useModal();
  const { data: post, isLoading, isError } = usePostDetail(id, {
    onError: errorModal.open,
  });
  const update = useUpdatePost(id);

  const handleSubmit = (data: PostFormData) => {
    update.mutate(data, { onSuccess: () => router.push("/post") });
  };

  if (isLoading)
    return (
      <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
        <p className="py-20 text-center text-sm text-slate-400">로딩 중...</p>
      </main>
    );

  if (isError || !post)
    return (
      <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
        <p className="py-20 text-center text-sm text-slate-400">
          게시글을 불러올 수 없습니다.
        </p>
      </main>
    );

  return (
    <>
      <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
        <PostForm
          initialData={{ title: post.title, content: post.content, image: post.image }}
          onSubmit={handleSubmit}
          isSubmitting={update.isPending}
          submitLabel="수정"
        />
      </main>
      {errorModal.isOpen && <ErrorModal onClose={errorModal.close} />}
    </>
  );
}
