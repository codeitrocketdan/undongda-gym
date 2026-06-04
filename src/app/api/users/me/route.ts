// app/api/users/me/route.ts
import { clearAuthCookies } from "@/shared/lib/auth/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // 백엔드 API에 유저 정보 첫 요청
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // accessToken 만료 시 (401) 재갱신 및 재요청 로직
  if (response.status === 401) {
    try {
      // 백엔드에 토큰 재갱신 요청
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!refreshResponse.ok) {
        if (refreshResponse.status === 401) {
          console.log("리프레시 토큰도 만료되어 쿠키를 삭제합니다.");
          await clearAuthCookies();
        }

        throw new Error(`액세스 토큰 재발급에 실패했습니다.`);
      }

      const data = await refreshResponse.json();

      // 토큰 재갱신 성공 후 백엔드에 유저 정보 재요청
      const retryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );

      if (!retryResponse.ok) {
        return NextResponse.json(
          { message: "재요청 유저 조회 실패" },
          { status: retryResponse.status }
        );
      }

      const user = await retryResponse.json();

      // 새로운 응답 객체를 만들고 브라우저 쿠키 직접 설정
      const nextResponse = NextResponse.json(user);

      nextResponse.cookies.set("accessToken", data.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 15,
      });

      if (data.refreshToken) {
        nextResponse.cookies.set("refreshToken", data.refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return nextResponse;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "인증이 만료되었습니다. 다시 로그인해주세요." },
        { status: 401 }
      );
    }
  }

  // 첫 번째 요청이 401이 아니면서 실패했을 경우 처리 (예: 500, 404 등)
  if (!response.ok) {
    return NextResponse.json(
      { message: "유저 조회 실패" },
      { status: response.status }
    );
  }

  // 첫 번째 요청이 한 번에 성공했을 경우 바로 반환
  const user = await response.json();
  return NextResponse.json(user);
}
