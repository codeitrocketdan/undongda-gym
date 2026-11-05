import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/getMe";

// 로그인 유저 조회는 이 쿼리 하나로 통일 (useAuth, useUser, useUserProfile이 모두 같은 캐시를 사용)
export const useUserQuery = () => {
  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 14 * 60 * 1000, // 14분 (토큰 만료 1분 전에 리페치)
    gcTime: 30 * 60 * 1000, // 30분 (토큰 재발급 후에도 캐시 유지)
    refetchOnWindowFocus: true,
  });

  return { user, isLoading, isError, isAuthenticated: !!user };
};
