/**
 * 클라이언트 컴포넌트 전용 Fetcher (토큰 필요 없는 요청)
 *
 * 1. 클라이언트 컴포넌트 -> BFF(Route Handler) 요청
 * ex) clientFetcher.post("/api/users/me")
 *
 * 2. 클라이언트 컴포넌트 -> 백엔드 직접 요청
 * ex) clientFetcher.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews`)
 */

import { ApiError, RequestOptions } from "./types";

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data?.message || "API 호출에 실패했습니다.");
  }

  return data as T;
};

export const clientFetcher = {
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
