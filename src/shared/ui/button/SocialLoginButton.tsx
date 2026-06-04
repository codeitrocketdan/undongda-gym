import { cva } from "class-variance-authority";
import Image from "next/image";
import React from "react";
import googleLogo from "../../assets/icons/google-logo.svg";
import kakaoLogo from "../../assets/icons/kakao-logo.svg";
interface PropsType {
  variant: "google" | "kakao";
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const buttonVariants = cva(
  "text-base-semibold flex w-full cursor-pointer rounded-xl items-center justify-center gap-2.5 rounded-xl px-3 py-3 text-gray-800 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        google: "border border-gray-200 bg-white",
        kakao: "bg-[#FFEE01]",
      },
    },
  }
);

const SOCIAL_CONFIG = {
  google: {
    icon: googleLogo,
    alt: "Google Login",
  },
  kakao: {
    icon: kakaoLogo,
    alt: "Kakao Login",
  },
};

const SocialLoginButton = ({ variant, children, onClick }: PropsType) => {
  const { icon, alt } = SOCIAL_CONFIG[variant];

  return (
    <button type="button" onClick={onClick} className={buttonVariants({ variant })}>
      <Image src={icon} alt={alt} width={24} height={24} />
      <span>{children}</span>
    </button>
  );
};

export default SocialLoginButton;
