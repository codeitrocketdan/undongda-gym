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

// 반응형 버튼 사이즈
// 모바일-데스크탑 사이즈 조합
type ResposiveType = "sm-sm" | "sm-md" | "md-md" | "md-lg" | "lg-lg";

// 기본 버튼 스타일 정의
const sizes: Record<SizeType, string> = {
  sm: "rounded-[10px] px-6 py-2 text-sm font-semibold",
  md: "rounded-xl px-7.5 py-4 text-base font-semibold",
  lg: "rounded-2xl px-10 py-5 text-xl font-semibold",
};

// 태블릿-데스크탑 반응형 스타일 정의
const resposiveClasses: Record<ResposiveType, string> = {
  "sm-sm":
    "sm:rounded-[10px] sm:px-6 sm:py-2 sm:text-sm lg:rounded-[10px] lg:px-6 lg:py-2 lg:text-sm",
  "sm-md":
    "sm:rounded-[10px] sm:px-6 sm:py-2 sm:text-sm lg:rounded-xl lg:px-7.5 lg:py-4 lg:text-base",
  "md-md":
    "sm:rounded-xl sm:px-7.5 sm:py-4 sm:text-base lg:rounded-xl lg:px-7.5 lg:py-4 lg:text-base",
  "md-lg":
    "sm:rounded-xl sm:px-7.5 sm:py-4 sm:text-base lg:rounded-2xl lg:px-10 lg:py-5 lg:text-xl",
  "lg-lg": "sm:rounded-2xl sm:px-10 sm:py-5 sm:text-xl lg:rounded-2xl lg:px-10 lg:py-5 lg:text-xl",
};

// 버튼 variant 관리
const buttonVariants = cva("flex items-center justify-center cursor-pointer", {
  variants: {
    // 버튼 디자인
    variant: {
      primary: "bg-blue-500 text-white hover:bg-blue-700",
      secondary: "border border-blue-600 bg-white text-blue-600",
      tertiary: "border border-gray-600 bg-white text-gray-600",
    },

    // 기본 버튼 사이즈
    size: sizes,

    // 반응형 버튼 사이즈
    resposive: resposiveClasses,

    // disabled 상태
    disabled: {
      true: "cursor-not-allowed bg-gray-100 text-gray-600",
      false: "cursor-pointer",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

interface PropsType {
  children: React.ReactNode;
  variant: VariantType;
  size?: SizeType;
  resposive: ResposiveType;
  isDisabled?: boolean;
  onClick: () => void;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  resposive = "md-md",
  isDisabled = false,
  onClick,
}: PropsType) => {
  // 버튼 클래스 병합
  const buttonClasses = twMerge(
    clsx(buttonVariants({ variant, size, resposive, disabled: isDisabled }))
  );

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
