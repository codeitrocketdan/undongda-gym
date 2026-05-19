import { formatDate } from "@/shared/lib/formatDate";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AuthorProps {
  name: string;
  image: string | null;
  createdAt: string | null;
  className?: string;
}

export default function Author({ image, name, createdAt, className }: AuthorProps) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-1.5 text-xs text-slate-500 md:gap-2 md:text-sm",
        className
      )}
    >
      {image ? (
        <div className="relative h-6 w-6 overflow-hidden rounded-full">
          <Image src={image} alt="" fill className="object-cover" />
        </div>
      ) : (
        <CircleUserRound className="h-6 w-6 text-slate-400" />
      )}
      <span>{name}</span>
      <span>{formatDate(createdAt)}</span>
    </div>
  );
}
