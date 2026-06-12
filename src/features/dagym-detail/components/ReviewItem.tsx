import { formatDate } from "@/shared/lib/formatDate";
import Author from "@/shared/ui/author/Author";
import Rating from "@/shared/ui/rating/Rating";
import { Dagym } from "../model/types";

interface Props {
  dagym: Dagym;
  rating: number;
  content: string;
}

const ReviewItem = ({ dagym, rating, content }: Props) => {
  const { name, image } = dagym.host;

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="mb-6">
        <Rating score={rating} className="mb-2" />

        <div className="flex items-center gap-1.5">
          <Author name={name} image={image} />
          <span className="text-xs text-slate-500 md:text-sm">
            {formatDate(dagym.createdAt)}
          </span>
        </div>
      </div>

      <p className="text-base-regular text-gray-700">{content}</p>
    </div>
  );
};

export default ReviewItem;
