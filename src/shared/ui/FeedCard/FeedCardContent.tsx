interface FeedCardContentProps {
  content: string;
  className?: string;
}

export default function FeedCardContent({ content, className }: FeedCardContentProps) {
  return (
    <div className={`text-sm md:text-lg ${className ?? ""}`}>
      <span>{content}</span>
    </div>
  );
}
