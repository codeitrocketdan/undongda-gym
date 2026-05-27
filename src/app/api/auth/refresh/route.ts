import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Refresh Token 없음" }, { status: 401 });
  }

  // 백엔드 서버로 토큰 갱신 요청
  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) {
    return NextResponse.json({ message: "토큰 재발급 실패" }, { status: 401 });
  }

  const tokens = await refreshRes.json();
  const { currentAccessToken, refreshToken: newRefreshToken } = tokens;

  cookieStore.set("accessToken", currentAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  if (newRefreshToken) {
    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
