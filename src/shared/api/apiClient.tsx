const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export const apiClient = async (endpoint: string, options: ApiClientOptions = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, data.message || "API 호출에 실패했습니다.");
  }

  return data;
};
