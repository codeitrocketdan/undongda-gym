import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_HINT_COOKIE,
  AUTH_HINT_COOKIE_OPTIONS,
} from "@/shared/lib/auth/authHint";

// 로그인해야 접근 가능한 페이지
const PROTECTED_ROUTES = ["/mypage", "/admin"];

// 로그인된 사용자는 접근 불가
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 쿠키에서 accessToken 확인
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 현재 요청 경로가 보호 페이지인지 확인 (경로중 1개라도 포함되면 true)
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 현재 요청 경로가 로그인/회원가입 페이지인지 확인 (경로중 1개라도 포함되면 true)
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 로그인 안되어 있으면 로그인 페이지 이동
  if (isProtected && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 사용자가 로그인/회원가입 페이지 접근 시 홈 이동
  if (isAuth && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  // 표시용 쿠키를 토큰 상태와 맞춤 (표시용 쿠키 도입 전에 로그인한 사용자, 토큰 만료 등)
  const hasToken = !!accessToken || !!refreshToken;
  const hasHint = request.cookies.get(AUTH_HINT_COOKIE)?.value === "1";

  if (hasToken && !hasHint) {
    response.cookies.set(AUTH_HINT_COOKIE, "1", AUTH_HINT_COOKIE_OPTIONS);
  } else if (!hasToken && hasHint) {
    response.cookies.delete(AUTH_HINT_COOKIE);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
