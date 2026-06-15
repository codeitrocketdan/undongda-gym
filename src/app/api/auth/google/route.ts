import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types"; // ApiError 타입 임포트 필요
import { setAuthCookies } from "@/shared/lib/auth/cookies";
import { NextResponse } from "next/server";

interface GoogleLoginRequest {
  code: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = await serverFetcher.post<GoogleLoginRequest, LoginResponse>(
      `/oauth/google`,
      body,
      { isPublic: true }
    );

    const { accessToken, refreshToken } = data;

    // 쿠키 저장
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      { message: "OAuth 구글 로그인 성공" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    // fetcher에서 던진 ApiError인 경우 해당 status와 메시지를 그대로 클라이언트에 전달
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message || "OAuth 로그인 실패" },
        { status: error.status || 401 }
      );
    }

    // 그 외 일반적인 서버 에러 처리
    return NextResponse.json(
      { message: "구글 로그인에 실패했습니다." },
      { status: 500 }
    );
  }
}
