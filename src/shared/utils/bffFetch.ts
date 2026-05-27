import { cookies } from "next/headers";

export async function bffFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  // 1. 기본 헤더 세팅 및 최초 요청
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  let res = await fetch(apiUrl, { ...options, headers });

  // 2. 만약 401(만료) 에러가 났고 리프레시 토큰이 있다면 재발급
  if (res.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const tokens = await refreshRes.json();

        // 새로운 토큰들을 쿠키에 저장
        cookieStore.set("accessToken", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 15,
        });

        if (tokens.refreshToken) {
          cookieStore.set("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }

        // 3. 새 토큰으로 헤더를 교체하여 재요청
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        };

        res = await fetch(apiUrl, { ...options, headers: newHeaders });
      } else {
        // 리프레시 토큰마저 만료된 경우 쿠키 청소
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
      }
    } catch (error) {
      console.error("BFF 토큰 재발급 중 에러:", error);
    }
  }

  return res;
}
