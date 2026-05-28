import { setAuthCookies } from "@/shared/lib/auth/cookies";
import { post } from "@/shared/lib/fetch";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await post(`/oauth/google`, body);

    if (!res.ok) {
      return NextResponse.json({ message: "OAuth 로그인 실패" }, { status: 401 });
    }

    const { accessToken, refreshToken } = await res.json();

    // 쿠키 저장
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ message: "OAuth 구글 로그인 성공" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "구글 로그인에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
