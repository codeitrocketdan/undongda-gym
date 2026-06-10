import { useQuery } from "@tanstack/react-query";
import { UserProfileDTO } from "../types";

export function useUserProfile() {
  return useQuery<UserProfileDTO>({
    queryKey: ["users/me"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      return res.json();
    },
  });
}
