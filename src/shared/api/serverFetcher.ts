/**
 * serverFetcher
 *
 * 사용 위치
 * - Server Component
 * - Server Action
 * - Route Handler
 *
 * 요청 경로
 * - 백엔드 경로 사용 (/users/me)
 *
 * 예시
 * const user = await serverFetcher.get<User>("/users/me");
 *
 * 공개 API 호출
 * await serverFetcher.post(
 *   "/auth/login",
 *   body,
 *   { isPublic: true }
 * );
 *
 * 주의
 * - next/headers를 사용하여 accessToken을 자동 추가합니다.
 * - Client Component에서는 사용할 수 없습니다.
 */

import { cookies } from "next/headers";
import { clearAuthCookies, setAuthCookies } from "@/shared/lib/auth/cookies";
import { ApiError } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  isPublic?: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

const callBackend = (
  path: string,
  { body, headers, isPublic, ...restOptions }: RequestOptions,
  accessToken?: string
) =>
  fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...headers,
    },
    ...(body !== undefined && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  });

// accessToken 만료(401) 시 refreshToken으로 재발급 시도. 실패하면 null.
const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;
  return (await response.json()) as RefreshTokenResponse;
};

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { isPublic = false } = options;

  const cookieStore = await cookies();
  const accessToken = isPublic
    ? undefined
    : cookieStore.get("accessToken")?.value;

  let response = await callBackend(path, options, accessToken);

  if (response.status === 401 && !isPublic) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);

      if (refreshed) {
        await setAuthCookies(refreshed.accessToken, refreshed.refreshToken ?? null);
        response = await callBackend(path, options, refreshed.accessToken);
      } else {
        await clearAuthCookies();
      }
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "요청에 실패했습니다." }));

    throw new ApiError(response.status, error.message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

export const serverFetcher = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "GET",
    }),

  post: <TRequest, TResponse>(
    path: string,
    body?: TRequest,
    options?: RequestOptions
  ) =>
    request<TResponse>(path, {
      ...options,
      method: "POST",
      body,
    }),

  put: <TRequest, TResponse>(
    path: string,
    body: TRequest,
    options?: RequestOptions
  ) =>
    request<TResponse>(path, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: <TRequest, TResponse>(
    path: string,
    body: TRequest,
    options?: RequestOptions
  ) =>
    request<TResponse>(path, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "DELETE",
    }),
};
