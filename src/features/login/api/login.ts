import { LoginFormValues } from "../model/types";

export const login = async (loginData: LoginFormValues) => {
  return fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};
