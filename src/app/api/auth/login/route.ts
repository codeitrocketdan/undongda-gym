import { publicServerFetcher } from "@/shared/api/publicServerFetcher";
import { ApiError } from "@/shared/api/types";
import { setAuthCookies } from "@/shared/lib/auth/cookies";
import { NextResponse } from "next/server";

interface LoginRequest {
  email?: string;
  password?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();

    const data = await publicServerFetcher.post<LoginRequest, LoginResponse>(
      "/auth/login",
      body
    );

    const { accessToken, refreshToken } = data;

    // 쿠키 저장
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      { message: "로그인에 성공하셨습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message || "로그인에 실패하셨습니다." },
        { status: error.status || 401 }
      );
    }

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
