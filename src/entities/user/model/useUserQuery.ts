import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/getMe";

export const useUserQuery = (enabled: boolean) => {
  const { data: user = null, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 15,
  });
  return { user, isLoading, isAuthenticated: !!user };
};
