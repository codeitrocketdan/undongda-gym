import { setAuthCookies } from "@/shared/lib/auth/cookies";
import { post } from "@/shared/lib/fetch";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await post("/auth/login", body);

  if (!res.ok) {
    return NextResponse.json({ message: "로그인에 실패하셨습니다." }, { status: 401 });
  }

  const { accessToken, refreshToken } = await res.json();

  // 쿠키 저장
  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({ message: "로그인에 성공하셨습니다." }, { status: 200 });
}
