// 로그인 여부만 알려주는 표시용 쿠키 (토큰 아님)
// 토큰 쿠키는 httpOnly라 브라우저에서 읽을 수 없어서, 정적 페이지에서 로그인 상태를 미리 알기 위해 사용
export const AUTH_HINT_COOKIE = "isLoggedIn";

// refreshToken과 같은 수명, 클라이언트에서 읽을 수 있도록 httpOnly 해제
export const AUTH_HINT_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export const hasAuthHint = () =>
  document.cookie.split("; ").includes(`${AUTH_HINT_COOKIE}=1`);
