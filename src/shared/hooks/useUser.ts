"use client";

import { UserProfileDTO } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserProfileDTO | null>({
    queryKey: ["users/me"],
    queryFn: () =>
      clientFetcher.get<UserProfileDTO>("/api/users/me").catch(() => null),
  });

  return { user, isLoading, isError };
}
