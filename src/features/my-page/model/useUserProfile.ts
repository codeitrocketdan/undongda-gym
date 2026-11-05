import { useUserQuery } from "@/entities/user";

// 헤더(useAuth)와 같은 유저 쿼리를 공유 (기존 반환 형태 { data } 유지)
export function useUserProfile() {
  const { user } = useUserQuery();

  return { data: user };
}
