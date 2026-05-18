import { ReactNode } from "react";

interface TagsProps {
  tags: string[];
  icon?: ReactNode;
  className?: string;
}

export default function Tags({ tags, icon, className }: TagsProps) {
  return (
    <div className={`${className ?? ""} text-xs text-slate-500 md:text-sm`}>
      {icon && icon}
      {tags.map((tag, index) => (
        <span key={tag}>
          {tag}
          {index < tags.length - 1 && <span className="mx-1">·</span>}
        </span>
      ))}
    </div>
  );
}
