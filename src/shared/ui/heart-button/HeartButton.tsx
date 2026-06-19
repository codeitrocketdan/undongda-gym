"use client";

import { Heart } from "lucide-react";
import { twMerge } from "tailwind-merge";
import IconButton from "../button/IconButton";

interface HeartButtonProps {
  isFavorited: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HeartButton({
  isFavorited,
  onClick,
  size = "md",
  className,
}: HeartButtonProps) {
  return (
    <IconButton
      size={size}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={twMerge(
        "shrink-0 bg-white transition-transform duration-200 hover:scale-110 active:scale-95",
        className
      )}
      iconClassName={
        isFavorited
          ? "fill-blue-500 stroke-blue-500"
          : "stroke-slate-400 fill-none"
      }
    >
      <Heart />
    </IconButton>
  );
}
