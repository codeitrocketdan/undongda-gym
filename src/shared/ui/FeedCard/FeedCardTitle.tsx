import { twMerge } from "tailwind-merge";

interface FeedCardTitleProps {
  title: string;
  className?: string;
}

export default function FeedCardTitle({ title, className }: FeedCardTitleProps) {
  return <p className={twMerge("text-base-bold md:text-xl-bold", className)}>{title}</p>;
}
