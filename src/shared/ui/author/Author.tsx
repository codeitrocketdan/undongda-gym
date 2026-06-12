import avatarImage from "@/shared/assets/images/avatar.svg";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AuthorProps {
  name: string;
  image: string | null;
  className?: string;
}

export default function Author({ image, name, className }: AuthorProps) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-1.5 text-xs text-slate-500 md:gap-2 md:text-sm",
        className
      )}
    >
      <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
        <Image
          src={image ?? avatarImage}
          alt="사용자 이미지"
          width={24}
          height={24}
          className="object-cover"
        />
      </div>
      <span>{name}</span>
    </div>
  );
}
