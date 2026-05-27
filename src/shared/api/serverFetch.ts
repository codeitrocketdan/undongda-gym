import { cookies } from "next/headers";

export const serverFetch = async (endpoint: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
};
