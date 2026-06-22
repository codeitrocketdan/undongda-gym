import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface FullBleedProps {
  className?: string;
  children: ReactNode;
}

// 부모(max-w-7xl)에 갇히지 않고 배경이 화면 끝까지 이어지도록 만드는 래퍼
export default function FullBleed({ className, children }: FullBleedProps) {
  return (
    <div className={twMerge("relative left-1/2 w-screen -translate-x-1/2", className)}>
      {children}
    </div>
  );
}
