import avatarImage from "@/shared/assets/images/avatar.svg";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AuthorProps {
  name: string;
  image: string | null;
  className?: string;
  onClick?: () => void;
}

export default function Author({ image, name, className, onClick }: AuthorProps) {
  const classNames = twMerge(
    "flex items-center gap-1.5 text-xs text-slate-500 md:gap-2 md:text-sm",
    onClick && "cursor-pointer hover:text-slate-700",
    className
  );

  const content = (
    <>
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
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classNames}>
        {content}
      </button>
    );
  }

  return <div className={classNames}>{content}</div>;
}
