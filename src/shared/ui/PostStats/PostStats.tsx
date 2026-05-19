import { formatRelativeDate } from "@/shared/lib/formatDate";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface PostStatsProps {
  likeCount: number;
  commentCount: number;
  createdAt: string;
  className?: string;
}

export default function PostStats({
  likeCount,
  commentCount,
  createdAt,
  className,
}: PostStatsProps) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-2 text-xs text-slate-500 md:gap-3 md:text-sm",
        className
      )}
    >
      <span>{formatRelativeDate(createdAt)}</span>
      <div className="flex items-center gap-0.5">
        <ThumbsUp className="h-3.75 w-3.75" />
        <span>{likeCount}</span>
      </div>
      <div className="flex items-center gap-0.5">
        <MessageCircle className="h-3.75 w-3.75" />
        <span>{commentCount}</span>
      </div>
    </div>
  );
}
