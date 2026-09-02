import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface FeedCardImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export default function FeedCardImage({
  src,
  alt = "",
  className,
  priority = false,
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
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
  );
}
