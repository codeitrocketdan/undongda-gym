import Author from "@/shared/ui/Author/Author";
import FeedCard from "@/shared/ui/FeedCard/FeedCard";
import FeedCardBody from "@/shared/ui/FeedCard/FeedCardBody";
import FeedCardContent from "@/shared/ui/FeedCard/FeedCardContent";
import FeedCardImage from "@/shared/ui/FeedCard/FeedCardImage";
import Rating from "@/shared/ui/Rating/Rating";
import Tags from "@/shared/ui/Tags/Tags";
import { ReviewCardProps } from "../types";

export default function ReviewCard({
  score,
  comment,
  image,
  createdAt,
  author,
  tags,
}: ReviewCardProps) {
  return (
    <FeedCard className="w-full md:max-w-157 lg:max-w-304">
      <FeedCardImage src={image} className="hidden md:block" />
      <FeedCardBody>
        <Rating score={score} className="mb-1.5" />
        <Author name={author.name} image={author.image} createdAt={createdAt} className="mb-3" />
        <FeedCardImage src={image} className="mb-3 md:hidden" />
        <FeedCardContent content={comment} className="mb-4 line-clamp-2 md:mb-10" />
        <Tags tags={tags} />
      </FeedCardBody>
    </FeedCard>
  );
}
