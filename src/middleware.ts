// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
// 찜한 모임, 마이페이지, 모임 상세페이지 - 주최자
const PROTECTED_ROUTES = ["/mypage"];
// 로그인, 회원가입 페이지 - 로그인한 사용자는 접근 불가
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // 로그인 여부
  const isLoggedIn = !!(accessToken || refreshToken);
  // 보호된 경로에 접근하려는 경우 로그인 여부 확인
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  // 인증 경로에 접근하려는 경우 로그인 여부 확인
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// 보호된 경로와 인증 경로에 대해서만 미들웨어가 실행되도록 matcher 설정
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
