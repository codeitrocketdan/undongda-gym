import React from "react";

interface FeedCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function FeedCardBody({ children, className }: FeedCardBodyProps) {
  return (
    <div
      className={`flex flex-1 flex-col border-b border-slate-200 pt-2 pb-6 md:pt-4 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
