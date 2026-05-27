import { NextRequest, NextResponse } from "next/server";

// 보호 페이지
const PROTECTED_ROUTES = ["/mypage"];

// 로그인된 사용자는 접근 불가
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 현재 요청 경로가 보호 페이지인지 확인
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // 현재 요청 경로가 로그인/회원가입 페이지인지 확인
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // access token 없고 refresh token만 있으면 토큰 재발급 시도
  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      // refresh 실패
      if (!refreshRes.ok) {
        const response = isProtected
          ? NextResponse.redirect(new URL("/login", request.url))
          : NextResponse.next();

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
      }

      const tokens = await refreshRes.json();

      const newAccessToken = tokens.accessToken;

      const newRefreshToken = tokens.refreshToken;

      const response = NextResponse.next();

      // access token 저장
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
      });

      // refresh token 저장
      if (newRefreshToken) {
        response.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return response;
    } catch (error) {
      console.log(error);

      return NextResponse.next();
    }
  }

  // 보호 페이지 접근
  if (isProtected && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 사용자가 로그인/회원가입 접근 시
  if (isAuth && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
