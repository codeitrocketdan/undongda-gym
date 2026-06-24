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
 * - 쿠키는 브라우저가 자동 전송합니다 (SSR에서는 next/headers로 직접 전달).
 */

import { ApiError } from "./types";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

// SSR(서버에서 client 컴포넌트를 먼저 렌더링하는 경우)에서는 이 fetch가
// 브라우저가 아닌 Node에서 자기 자신(BFF)에게 보내는 별도 요청이라 쿠키가
// 자동으로 실리지 않는다. next/headers로 원본 요청의 쿠키를 직접 읽어 전달한다.
const getServerCookieHeader = async () => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.toString();
};

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { body, headers, ...restOptions } = options;
  const cookieHeader =
    typeof window === "undefined" ? await getServerCookieHeader() : null;

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...restOptions,
    headers: {
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(cookieHeader && { Cookie: cookieHeader }),
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
