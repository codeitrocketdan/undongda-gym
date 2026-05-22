"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
  process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const useKakaoLogin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loginWithKakao = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  useEffect(() => {
    const code = searchParams?.get("code");

    if (!code) return;

    const kakaoLogin = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(data.message || "카카오 로그인에 실패했습니다.");
        }
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    };

    kakaoLogin();
  }, [searchParams]);

  return {
    loginWithKakao,
  };
};
