import React from "react";
import FeedCardBody from "./FeedCardBody";
import FeedCardContent from "./FeedCardContent";
import FeedCardImage from "./FeedCardImage";
import FeedCardTitle from "./FeedCardTitle";

interface FeedCardProps {
  children: React.ReactNode;
  className?: string;
}

function FeedCard({ children, className }: FeedCardProps) {
  return (
    <div
      className={`group flex flex-col bg-white transition-all duration-300 hover:-translate-y-0.5 md:flex-row md:gap-8 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default Object.assign(FeedCard, {
  Image: FeedCardImage,
  Body: FeedCardBody,
  Title: FeedCardTitle,
  Content: FeedCardContent,
});
