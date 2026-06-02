import { cookies } from "next/headers";

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const serverFetcher = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const requestUrl = path.startsWith("http") ? path : `${API_URL}${path}`;

  const res = await fetch(requestUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) return null as T;
  return res.json();
};
