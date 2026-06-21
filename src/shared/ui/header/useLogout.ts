"use client";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { resetFavoritesCount } from "@/shared/hooks/useNewFavoritesCount";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    try {
      await clientFetcher.post("/api/auth/logout");
      resetFavoritesCount();
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
}
