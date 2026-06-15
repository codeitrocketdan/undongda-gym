"use client";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    try {
      await clientFetcher.post("/api/auth/logout");
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
}
