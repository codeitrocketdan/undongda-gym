/**
 * clientFetcher
 *
 * 사용 위치
 * - Client Component
 * - React Query(queryFn, mutationFn)
 * - 이벤트 핸들러(onClick, onSubmit)
 *
 * 요청 경로
 * - 반드시 BFF(/api/*) 사용
 *
 * 예시
 * const user = await clientFetcher.get<User>("/api/users/me");
 *
 * 주의
 * - 백엔드 주소를 직접 호출하지 않습니다.
 * - accessToken을 직접 읽지 않습니다.
 * - 쿠키는 브라우저가 자동 전송합니다.
 */

import { ApiError } from "./types";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { body, headers, ...restOptions } = options;

  const response = await fetch(path, {
    ...restOptions,
    headers: {
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    ...(body !== undefined && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  });

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
