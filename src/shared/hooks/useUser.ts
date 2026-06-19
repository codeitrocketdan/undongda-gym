"use client";

import { UserProfileDTO } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { ApiError } from "@/shared/api/types";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserProfileDTO | null>({
    queryKey: ["users/me"],
    queryFn: async () => {
      try {
        return await clientFetcher.get<UserProfileDTO>("/api/users/me");
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 14 * 60 * 1000, // 14분 (토큰 만료 1분 전에 리페치)
    gcTime: 30 * 60 * 1000, // 30분 (토큰 재발급 후에도 캐시 유지)
  });

  return { user, isLoading, isError };
}
