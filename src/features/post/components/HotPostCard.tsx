import FeedCard from "@/shared/ui/feed-card/FeedCard";
import PostStats from "@/shared/ui/post-stats/PostStats";
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
      <FeedCard className="flex w-40.5 flex-col gap-2.5 md:w-75.5 md:gap-3.5">
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
