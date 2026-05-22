import Author from "@/shared/ui/Author/Author";
import FeedCard from "@/shared/ui/FeedCard/FeedCard";
import Rating from "@/shared/ui/Rating/Rating";
import Tags from "@/shared/ui/Tags/Tags";
import Link from "next/link";
import { ReviewCardProps } from "../types";

export default function ReviewCard({
  id,
  score,
  comment,
  image,
  createdAt,
  author,
  tags,
}: ReviewCardProps) {
  return (
    <Link href={`/meetings/${id}`}>
      <FeedCard className="w-full md:max-w-157 lg:max-w-304">
        <FeedCard.Image src={image} className="hidden md:block" />
        <FeedCard.Body>
          <Rating score={score} className="mb-1.5" />
          <Author name={author.name} image={author.image} createdAt={createdAt} className="mb-3" />
          <FeedCard.Image src={image} className="mb-3 md:hidden" />
          <FeedCard.Content content={comment} className="mb-4 line-clamp-2 md:mb-10" />
          <Tags tags={tags} />
        </FeedCard.Body>
      </FeedCard>
    </Link>
  );
}
