import Author from "@/shared/ui/Author/Author";
import FeedCard from "@/shared/ui/FeedCard/FeedCard";
import FeedCardBody from "@/shared/ui/FeedCard/FeedCardBody";
import FeedCardContent from "@/shared/ui/FeedCard/FeedCardContent";
import FeedCardImage from "@/shared/ui/FeedCard/FeedCardImage";
import FeedCardTitle from "@/shared/ui/FeedCard/FeedCardTitle";
import PostStats from "@/shared/ui/PostStats/PostStats";
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
      <FeedCard className="w-full md:max-w-157 lg:max-w-304">
        <FeedCardImage src={image} className="hidden md:block" />
        <FeedCardBody>
          <FeedCardTitle title={title} className="mb-2" />
          <FeedCardImage src={image} className="mb-2 md:hidden" />
          <FeedCardContent content={content} className="mb-4 line-clamp-2 md:mb-10" />
          <div className="mt-auto flex items-end justify-between">
            <Author name={author.name} image={author.image} createdAt={author.createdAt} />
            <PostStats likeCount={likeCount} commentCount={commentCount} createdAt={createdAt} />
          </div>
        </FeedCardBody>
      </FeedCard>
    </Link>
  );
}
