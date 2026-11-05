"use client";

import { useUserQuery } from "@/entities/user";

// 헤더(useAuth)와 같은 유저 쿼리를 공유해 중복 요청과 프로필 깜빡임을 막음
export function useUser() {
  const { user, isLoading, isError } = useUserQuery();

  return { user, isLoading, isError };
}
