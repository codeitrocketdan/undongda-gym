import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { setAuthCookies } from "@/shared/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

interface KakaoLoginRequest {
  token: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // 카카오 인증 서버로 토큰 요청 (외부 API이므로 기존 fetch 유지)
    const kakaoTokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        code,
      }),
    });

    if (!kakaoTokenRes.ok) {
      return NextResponse.json(
        { message: "카카오 토큰 발급 실패" },
        { status: 401 }
      );
    }

    // 카카오 access_token 추출
    const { access_token } = await kakaoTokenRes.json();

    const data = await serverFetcher.post<KakaoLoginRequest, LoginResponse>(
      "/oauth/kakao",
      { token: access_token },
      { isPublic: true }
    );

    const { accessToken, refreshToken } = data;

    // 쿠키 저장
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      { message: "카카오 로그인 성공" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message || "카카오 로그인 실패" },
        { status: error.status || 401 }
      );
    }

    return NextResponse.json(
      { message: "카카오 로그인에 실패했습니다." },
      { status: 500 }
    );
  }
}
