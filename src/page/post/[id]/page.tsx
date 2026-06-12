"use client";

import { useUserProfile } from "@/features/my-page/model/useUserProfile";
import { useCommentActions } from "@/features/post/model/useCommentActions";
import {
  usePostDetail,
  usePostLike,
} from "@/features/post/model/usePostDetail";
import CommentList, {
  CommentListSkeleton,
} from "@/features/post/ui/CommentList";
import PostDetailSection, {
  PostDetailSectionSkeleton,
} from "@/features/post/ui/PostDetailSection";
import { useParams, useRouter } from "next/navigation";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: post, isLoading, isError } = usePostDetail(id);
  const { data: user } = useUserProfile();
  const like = usePostLike(id);
  const { submit, edit, remove } = useCommentActions(id);

  if (isLoading)
    return (
      <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
        <PostDetailSectionSkeleton />
        <CommentListSkeleton />
      </main>
    );

  if (isError || !post)
    return (
      <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
          <p className="text-center text-sm">
            페이지를 불러오는데 문제가 발생하였습니다.
            <br />
            잠시후 다시 시도해주세요.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-slate-500 underline hover:text-slate-700"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </main>
    );

  return (
    <main className="inner mx-auto mt-6 max-w-215 md:mt-8 lg:mt-9">
      <PostDetailSection
        post={post}
        isOwner={user?.id === post.authorId}
        onLike={() => like.mutate({ isLiked: post.isLiked })}
        onEdit={() => {}} // TODO: 게시글 수정 페이지 라우팅
        onDelete={() => {}} // TODO: 삭제 후 /post 이동
      />
      <CommentList
        comments={post.comments}
        currentUserId={user?.id ?? null}
        onSubmit={(content) => submit.mutate(content)}
        onEdit={(commentId, content) => edit.mutate({ id: commentId, content })}
        onDelete={(commentId) => remove.mutate(commentId)}
      />
    </main>
  );
}
