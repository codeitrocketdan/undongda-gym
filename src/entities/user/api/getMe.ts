import { User } from "../model/types";

export const getMe = async (): Promise<User | null> => {
  const response = await fetch("/api/users/me");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("유저 정보 조회 실패");
  }

  return response.json();
};
