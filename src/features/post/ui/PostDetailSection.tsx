"use client";

import { PostDetailDTO } from "@/features/post/types";
import { formatRelativeDate } from "@/shared/lib/formatDate";
import Author from "@/shared/ui/author/Author";
import Dropdown from "@/shared/ui/dropdown/Dropdown";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface PostDetailSectionProps {
  post: PostDetailDTO;
  isOwner: boolean;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostDetailSection({
  post,
  isOwner,
  onLike,
  onEdit,
  onDelete,
}: PostDetailSectionProps) {
  return (
    <div className="rounded-2xl bg-white p-8 md:rounded-3xl md:p-14 lg:p-16">
      {/* 제목 + 작성자 + 더보기 */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-xl-bold md:text-3xl-bold text-slate-800">
            {post.title}
          </span>
          <div className="flex items-center gap-2">
            <Author name={post.author.name} image={post.author.image} />
            <span className="text-sm text-slate-500">
              {formatRelativeDate(post.createdAt)}
            </span>
          </div>
        </div>
        {isOwner && (
          <Dropdown>
            <Dropdown.Trigger>
              <MoreHorizontal className="h-6 w-6 text-slate-400 cursor-pointer hover:text-slate-600" />
            </Dropdown.Trigger>
            <Dropdown.Menu>
              <Dropdown.Item onClick={onEdit}>수정</Dropdown.Item>
              <Dropdown.Item onClick={onDelete}>삭제</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {/* 본문 */}
      <p className="mb-8 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 md:text-base">
        {post.content}
      </p>

      {/* 이미지 */}
      {post.image && (
        <div className="relative mb-10 h-30 w-30 overflow-hidden rounded-2xl md:h-50 md:w-50">
          <Image
            src={post.image}
            alt="게시글 이미지"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 통계 */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>{formatRelativeDate(post.createdAt)}</span>
        <button
          type="button"
          onClick={onLike}
          className="flex items-center gap-0.5 cursor-pointer hover:text-slate-600"
        >
          <ThumbsUp
            className={`h-4 w-4 ${post.isLiked ? "fill-blue-300 text-blue-500" : ""}`}
          />
          <span>{post.likeCount}</span>
        </button>
        <div className="flex items-center gap-0.5">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </div>
      </div>
    </div>
  );
}

export function PostDetailSectionSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-8 md:rounded-3xl md:p-14 lg:p-16">
      <Skeleton className="mb-3 h-8 w-3/4" />
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-50" />
      </div>
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  );
}
