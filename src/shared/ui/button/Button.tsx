import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/shared/lib/cn";

// 버튼 기본 사이즈
// sm : 작은 버튼
// md : 중간 버튼
// lg : 큰 버튼
export const sizes = {
  sm: "rounded-[10px] px-6 py-2 text-sm font-semibold",
  md: "rounded-xl px-7.5 py-4 text-base font-semibold",
  lg: "rounded-2xl px-10 py-5 text-xl font-semibold",
};

// 버튼 variant 관리
export const buttonVariants = cva(
  "flex w-full items-center justify-center cursor-pointer",
  {
    variants: {
      // 버튼 디자인
      // primary   : 브랜드 컬러 배경 버튼
      // secondary : 브랜드 컬러 border 버튼
      // tertiary  : 회색 border 버튼
      variant: {
        primary: "bg-blue-500 text-white",
        secondary: "border border-blue-500 bg-white text-blue-500",
        tertiary: "border border-gray-500 bg-white text-gray-600",
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

// 네이티브 button 속성 + cva variant 타입
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    isDisabled?: boolean;
  };

const Button = ({
  type = "button",
  variant = "primary",
  size = "md",
  isDisabled = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  // 버튼 클래스 병합
  const buttonClasses = cn(
    buttonVariants({ variant, size, disabled: isDisabled }),
    className
  );

  return (
    <button
      {...props}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
