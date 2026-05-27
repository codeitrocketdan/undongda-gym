"use client";

import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
}

async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    // 비로그인
    if (res.status === 401) {
      return null;
    }

    // 서버 에러
    if (!res.ok) {
      throw new Error("유저 조회 실패");
    }

    const data = await res.json();

    return data.user;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export function useUser() {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  return {
    user,
    userLoading,
    userError,
  };
}
