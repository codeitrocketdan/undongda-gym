import Image from "next/image";
import { cn } from "@/shared/lib/cn";

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
    <div className={cn("relative overflow-hidden bg-slate-200", className)}>
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
  );
}
