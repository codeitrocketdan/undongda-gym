"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// 카카오 인증 후 redirect_uri로 돌아왔을 때 ?code=를 읽어 로그인 처리
export const useKakaoCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const code = searchParams?.get("code");

    if (!code) return;

    const kakaoLogin = async () => {
      try {
        const response = await fetch("/api/auth/kakao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "카카오 로그인에 실패했습니다.");
        }
        queryClient.invalidateQueries();
        router.push("/dagym");
      } catch (error) {
        console.error(error);
      }
    };

    kakaoLogin();
  }, [searchParams]);
};
