import { Heart } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface RatingProps {
  score: number;
  size?: number;
  className?: string;
}

export default function Rating({ score, size = 20, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Heart
          key={index}
          size={size}
          className={`${index < score ? "fill-blue-500" : "fill-slate-200"} stroke-none`}
        />
      ))}
    </div>
  );
}
