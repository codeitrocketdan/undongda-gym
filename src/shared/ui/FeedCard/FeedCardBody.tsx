import React from "react";
import { twMerge } from "tailwind-merge";

interface FeedCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function FeedCardBody({ children, className }: FeedCardBodyProps) {
  return (
    <div className={twMerge("flex flex-1 flex-col border-slate-200 pt-2 pb-6 md:pt-4", className)}>
      {children}
    </div>
  );
}
