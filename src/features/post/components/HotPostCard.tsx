import FeedCard from "@/shared/ui/feed-card/FeedCard";
import PostStats from "@/shared/ui/post-stats/PostStats";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import Link from "next/link";
import { HotPostCardProps } from "../types";

export default function HotPostCard({
  id,
  title,
  image,
  likeCount,
  commentCount,
  createdAt,
}: HotPostCardProps) {
  return (
    <Link href={`/posts/${id}`}>
      <FeedCard className="bg-f6f7f9 flex w-40.5 flex-col gap-2.5 rounded-xl md:w-72.5 md:gap-3.5 md:rounded-3xl">
        <FeedCard.Image
          src={image}
          className="h-40.5 w-full rounded-xl md:h-45 md:rounded-3xl"
        />
        <div className="flex flex-1 flex-col">
          <FeedCard.Title
            title={title}
            className="text-base-semibold md:text-xl-semibold mb-1.5 md:mb-2"
          />
          <PostStats
            likeCount={likeCount}
            commentCount={commentCount}
            createdAt={createdAt}
            className="text-sm"
          />
        </div>
      </FeedCard>
    </Link>
  );
}

export function HotPostCardSkeleton() {
  return (
    <div className="flex w-40.5 shrink-0 flex-col gap-2.5 md:w-72.5 md:gap-3.5">
      <Skeleton className="h-40.5 w-full rounded-xl md:h-45 md:rounded-3xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
