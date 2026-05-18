interface FeedCardTitleProps {
  title: string;
  className?: string;
}

export default function FeedCardTitle({ title, className }: FeedCardTitleProps) {
  return <p className={`text-base-bold md:text-xl-bold ${className ?? ""}`}>{title}</p>;
}
