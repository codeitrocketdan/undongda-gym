import Author from "@/shared/ui/author/Author";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import PostStats from "@/shared/ui/post-stats/PostStats";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import Link from "next/link";
import { PostCardProps } from "../types";

export default function PostCard({
  id,
  title,
  content,
  image,
  author,
  likeCount,
  commentCount,
  createdAt,
}: PostCardProps) {
  return (
    <Link href={`/posts/${id}`}>
      <FeedCard className="flex h-full w-full md:flex-row md:gap-8">
        <FeedCard.Image src={image} className="hidden h-50 w-50 shrink-0 rounded-2xl md:block" />
        <div className="flex flex-1 flex-col border-b border-slate-200 pt-2 pb-6 md:pt-4">
          <FeedCard.Title title={title} className="text-base-bold md:text-xl-bold mb-2" />
          <FeedCard.Image src={image} className="mb-3 h-36 rounded-xl md:hidden" />
          <p className="mb-4 line-clamp-2 min-h-[2lh] text-sm md:text-lg">{content}</p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Author name={author.name} image={author.image} />
            </div>
            <PostStats likeCount={likeCount} commentCount={commentCount} createdAt={createdAt} />
          </div>
        </div>
      </FeedCard>
    </Link>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-3xl bg-white p-4 md:p-6">
      <Skeleton className="hidden h-28 w-28 shrink-0 rounded-xl md:block" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </div>
    </div>
  );
}
