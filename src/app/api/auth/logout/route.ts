import { publicServerFetcher } from "@/shared/api/publicServerFetcher";
import { ApiError } from "@/shared/api/types";
import { clearAuthCookies } from "@/shared/lib/auth/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface LogoutRequest {
  refreshToken: string;
}

interface LogoutResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        { message: "이미 로그아웃된 상태입니다." },
        { status: 200 }
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    // 백엔드 세션/DB에서 해당 refreshToken 무효화 요청
    await publicServerFetcher.post<LogoutRequest, LogoutResponse>(
      "/auth/logout",
      { refreshToken }
    );

    const response = NextResponse.json(
      { message: "로그아웃에 성공하셨습니다." },
      { status: 200 }
    );

    clearAuthCookies();

    return response;
  } catch (error) {
    console.error("Logout Error", error);

    // 백엔드 서버 에러 핸들링
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message || "로그아웃 처리에 실패하셨습니다." },
        { status: error.status || 401 }
      );
    }

    return NextResponse.json(
      { message: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
