import React from "react";
import { twMerge } from "tailwind-merge";
import FeedCardImage from "./FeedCardImage";
import FeedCardTitle from "./FeedCardTitle";

interface FeedCardProps {
  children: React.ReactNode;
  className?: string;
}

function FeedCard({ children, className }: FeedCardProps) {
  return (
    <div
      className={twMerge(
        "group bg-white transition-all duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Object.assign(FeedCard, {
  Image: FeedCardImage,
  Title: FeedCardTitle,
});
