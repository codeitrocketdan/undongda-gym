"use client";

import { CommentDTO } from "@/features/post/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import Image from "next/image";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentDTO[];
  currentUserId: number | null;
  onSubmit: (content: string) => void;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

export default function CommentList({
  comments,
  currentUserId,
  onSubmit,
  onEdit,
  onDelete,
}: CommentListProps) {
  return (
    <div className="mt-10 md:mt-14 lg:mt-18">
      <span className="text-base-semibold md:text-xl-semibold mb-3 text-slate-800 md:mb-4">
        댓글 <span className="text-blue-500">{comments.length}</span>
      </span>
      <CommentInput onSubmit={onSubmit} />
      <div className="mt-8">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-slate-400">
            <Image src={emptyImage} alt="댓글 없음" width={120} height={72} />
            <p className="text-sm">첫 댓글을 작성해보세요.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={currentUserId === comment.authorId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function CommentListSkeleton() {
  return (
    <div className="mt-10 md:mt-14 lg:mt-18">
      <Skeleton className="mb-3 h-5 w-16" />
      <Skeleton className="mb-8 h-10 w-full rounded-xl" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-2 border-b border-slate-100 py-4 last:border-none"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
