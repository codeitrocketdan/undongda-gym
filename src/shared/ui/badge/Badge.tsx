import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

interface PropsType {
  children: React.ReactNode;
  className: string;
}

// className으로 text 종류, text 컬러, bg 컬러 넘겨 주세요.
// icon이 있을 시 icon을 따로 props로 보내지 않고, children과 같이 넘겨 주세요.
const Badge = ({ children, className }: PropsType) => {
  return (
    <span
      className={twMerge(clsx("inline-flex items-center gap-1 rounded-3xl px-3 py-1.5", className))}
    >
      {children}
    </span>
  );
};

export default Badge;
