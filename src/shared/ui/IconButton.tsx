import { cva } from "class-variance-authority";
import clsx from "clsx";
import React, { cloneElement } from "react";
import { twMerge } from "tailwind-merge";

// 버튼 기본 사이즈
type SizeType = "sm" | "md" | "lg";

// 버튼 전체 크기 정의
const sizes: Record<SizeType, string> = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-15 h-15",
};

// 버튼 안의 아이콘 크기 정의
const iconSizes: Record<SizeType, string> = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const iconVariants = cva(
  "flex items-center justify-center rounded-full border border-gray-200 cursor-pointer",
  {
    variants: {
      size: sizes,
      isDisabled: {
        true: "cursor-not-allowed",
      },
      defaultVariants: {
        size: "md",
      },
    },
  }
);

interface PropsType {
  children: React.ReactElement<{ className?: string }>;
  size: SizeType;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  iconClassName?: string;
}

const IconButton = ({
  children,
  size,
  onClick,
  isDisabled,
  className,
  iconClassName,
}: PropsType) => {
  // 아이콘 버튼 클래스 병합
  const iconButtonClasses = twMerge(clsx(iconVariants({ size, isDisabled }), className));

  // 아이콘 크기 적용
  const icon = React.isValidElement(children)
    ? cloneElement(children, { className: twMerge(iconSizes[size], iconClassName) })
    : children;

  return (
    <button onClick={onClick} className={iconButtonClasses}>
      {icon}
    </button>
  );
};

export default IconButton;
