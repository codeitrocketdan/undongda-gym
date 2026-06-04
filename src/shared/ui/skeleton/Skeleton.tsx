import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={twMerge("animate-pulse rounded bg-slate-200", className)}></div>;
}
