import { formatDate } from "@/shared/lib/formatDate";
import Author from "@/shared/ui/author/Author";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import Rating from "@/shared/ui/rating/Rating";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { ReviewCardProps } from "../types";

export default function ReviewCard({
  score,
  comment,
  image,
  createdAt,
  author,
  name,
  type,
}: ReviewCardProps) {
  return (
    <FeedCard className="flex h-full w-full md:flex-row md:gap-8">
      <FeedCard.Image
        src={image}
        className="hidden h-50 w-50 shrink-0 rounded-xl md:block"
      />
      <div className="flex flex-1 flex-col border-b border-slate-200 pt-2 pb-6 md:pt-4">
        <Rating score={score} className="mb-1.5" />
        <div className="mb-3 flex items-center gap-1.5 md:gap-2">
          <Author name={author.name} image={author.image} />
          <span className="text-xs text-slate-500 md:text-sm">
            {formatDate(createdAt)}
          </span>
        </div>
        <FeedCard.Image
          src={image}
          className="mb-3 h-36 rounded-xl md:hidden"
        />
        <p className="mb-4 line-clamp-2 min-h-[2lh] text-sm md:text-lg">
          {comment}
        </p>
        <span className="text-xs text-slate-500 md:text-sm">
          {name} · {type}
        </span>
      </div>
    </FeedCard>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-3xl bg-white p-4 md:p-6">
      <Skeleton className="hidden h-50 w-50 shrink-0 rounded-xl md:block" />
      <div className="flex flex-1 flex-col gap-2 py-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-2 h-3 w-28" />
      </div>
    </div>
  );
}
