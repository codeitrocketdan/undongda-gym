import { cva } from "class-variance-authority";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

// 버튼 디자인 종류
// primary   : 브랜드 컬러 배경 버튼
// secondary : 브랜드 컬러 border 버튼
// tertiary  : 회색 border 버튼
type VariantType = "primary" | "secondary" | "tertiary";

// 버튼 기본 사이즈
// sm : 작은 버튼
// md : 중간 버튼
// lg : 큰 버튼
type SizeType = "sm" | "md" | "lg";

// 기본 버튼 스타일 정의
export const sizes: Record<SizeType, string> = {
  sm: "rounded-[10px] px-6 py-2 text-sm font-semibold",
  md: "rounded-xl px-7.5 py-4 text-base font-semibold",
  lg: "rounded-2xl px-10 py-5 text-xl font-semibold",
};

// 버튼 variant 관리
const buttonVariants = cva(
  "flex w-full items-center justify-center cursor-pointer",
  {
    variants: {
      // 버튼 디자인
      variant: {
        primary: "bg-blue-600 text-white",
        secondary: "border border-blue-600 bg-white text-blue-600",
        tertiary: "border border-gray-600 bg-white text-gray-600",
      },

      // 기본 버튼 사이즈
      size: sizes,

      // disabled 상태
      disabled: {
        true: "cursor-not-allowed bg-gray-100 text-gray-600",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      { variant: "primary", disabled: false, className: "hover:bg-blue-700" },
    ],
    // 기본 값
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
);

interface PropsType {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  variant?: VariantType;
  size?: SizeType;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
}

const Button = ({
  type = "button",
  children,
  variant = "primary",
  size = "md",
  isDisabled = false,
  onClick,
  className,
  ariaLabel,
}: PropsType) => {
  // 버튼 클래스 병합
  const buttonClasses = twMerge(
    clsx(buttonVariants({ variant, size, disabled: isDisabled }), className)
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
