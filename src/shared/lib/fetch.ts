// .env 변수가 없을 때를 대비해 기본값 빈 문자열 처리
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}`;

// 커스텀 에러 타입 정의 (HTTP 상태 코드를 포함하기 위함)
interface HttpError extends Error {
  status?: number;
}

// request 함수의 옵션 타입 정의 (fetch의 RequestInit 타입을 확장)
interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

async function request(path: string, { headers, ...options }: RequestOptions = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const error: HttpError = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response;
}

// GET 요청
export async function get(path: string, options: RequestOptions = {}) {
  return request(path, {
    ...options,
    method: "GET",
  });
}

// POST 요청
export async function post<T>(path: string, data: T, options: RequestOptions = {}) {
  return request(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function put<T>(path: string, data: T, options: RequestOptions = {}) {
  return request(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
}
// PATCH 요청
export async function patch<T>(path: string, data: T, options: RequestOptions = {}) {
  return request(path, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// DELETE 요청
export async function del(path: string, options: RequestOptions = {}) {
  return request(path, {
    ...options,
    method: "DELETE",
  });
}
