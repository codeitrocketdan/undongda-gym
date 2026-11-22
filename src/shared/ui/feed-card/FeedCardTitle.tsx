import { cn } from "@/shared/lib/cn";

interface FeedCardTitleProps {
  title: string;
  className?: string;
}

export default function FeedCardTitle({
  title,
  className,
}: FeedCardTitleProps) {
  return <p className={cn("truncate", className)}>{title}</p>;
}
