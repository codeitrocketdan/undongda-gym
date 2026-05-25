import { cookies } from "next/headers";

export const serverFetch = async (endpoint: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();

  const currentAccessToken = cookieStore.get("accessToken")?.value;

  // 첫 요청 시도
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${currentAccessToken}`,
    },
  });

  // access token 만료
  if (res.status === 401) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error("Refresh Token 없음");
    }

    // refresh 요청
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    // refresh 실패
    if (!refreshRes.ok) {
      throw new Error("토큰 재발급 실패");
    }
    const tokens = await refreshRes.json();
    const newAccessToken = tokens.accessToken;
    const newRefreshToken = tokens.refreshToken;

    // 새로운 access token 저장
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });
    // 새로운 refresh token 저장
    if (newRefreshToken) {
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    // 원래 요청 재시도
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return res;
};
