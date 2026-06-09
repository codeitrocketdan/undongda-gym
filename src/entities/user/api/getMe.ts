import { clientFetcher } from "@/shared/api/clientFetcher";
import { ApiError } from "@/shared/api/types";
import { User } from "../model/types";

export const getMe = async (): Promise<User | null> => {
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
