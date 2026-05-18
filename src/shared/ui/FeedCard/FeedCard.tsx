import React from "react";

interface FeedCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FeedCard({ children, className }: FeedCardProps) {
  return (
    <div
      className={`group flex flex-col bg-white transition-all duration-300 hover:-translate-y-0.5 md:flex-row md:gap-8 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
