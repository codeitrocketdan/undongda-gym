import { clientFetcher } from "@/shared/api/clientFetcher";
import { ApiError } from "@/shared/api/types";
import { hasAuthHint } from "@/shared/lib/auth/authHint";
import { User } from "../model/types";

export const getMe = async (): Promise<User | null> => {
  // 로그인 표시 쿠키가 없으면 요청하지 않음 (비로그인 사용자의 불필요한 401 방지)
  if (!hasAuthHint()) return null;

  try {
    const user = await clientFetcher.get<User>("/api/users/me");

    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
};
