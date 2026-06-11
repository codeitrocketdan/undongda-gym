import { clientFetcher } from "@/shared/api/clientFetcher";
import { LoginFormValues } from "../model/types";

export const login = async (loginData: LoginFormValues) => {
  return clientFetcher.post("/api/auth/login", loginData);
};
