import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface FeedCardImageProps {
  src: string | null;
  alt?: string;
  className?: string;
}

export default function FeedCardImage({
  src,
  alt = "",
  className,
}: FeedCardImageProps) {
  return (
    <div
      className={twMerge("relative overflow-hidden bg-slate-200", className)}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
  );
}
