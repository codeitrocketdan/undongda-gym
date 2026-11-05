"use client";
import Script from "next/script";
import { Suspense } from "react";
import SocialLoginButton from "@/shared/ui/button/SocialLoginButton";
import { useGoogleLogin } from "../model/useGoogleLogin";
import { useKakaoLogin } from "../model/useKakaoLogin";
import { KakaoLoginCallback } from "./KakaoLoginCallback";

export const SocialLoginButtons = () => {
  const { loginWithGoogle } = useGoogleLogin();
  const { loginWithKakao } = useKakaoLogin();

  return (
    <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />

      <Suspense>
        <KakaoLoginCallback />
      </Suspense>

      <SocialLoginButton variant="google" onClick={loginWithGoogle}>
        구글로 계속하기
      </SocialLoginButton>

      <SocialLoginButton variant="kakao" onClick={loginWithKakao}>
        카카오로 계속하기
      </SocialLoginButton>
    </div>
  );
};
