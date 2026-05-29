import { cookies } from "next/headers";

import { post } from "../fetch";
import { clearAuthCookies, setAuthCookies } from "./cookies";

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const authFetch = async (path: string, options: RequestOptions = {}) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log(accessToken, "엑세스토큰");

  const requestUrl = path.startsWith("http") ? path : `${API_URL}${path}`;

  // 공통 요청 함수
  const request = (token: string | undefined) => {
    return fetch(requestUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  // 첫 요청
  let response = await request(accessToken);

  // accessToken 만료
  if (response.status === 401) {
    // refreshToken 없으면 로그아웃 처리
    if (!refreshToken) {
      await clearAuthCookies();
      throw new Error("RefreshToken 없음");
    }

    try {
      // 토큰 재발급
      const refreshResponse = await post("/auth/refresh", { refreshToken });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await refreshResponse.json();

      // 새 토큰 저장
      await setAuthCookies(newAccessToken, newRefreshToken);

      // 재요청
      response = await request(newAccessToken);

      return response;
    } catch (error) {
      // refresh 실패
      await clearAuthCookies();
      throw error;
    }
  }

  return response;
};
