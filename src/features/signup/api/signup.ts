import { serverFetcher } from "@/shared/api/serverFetcher";
import { SignupFormValues } from "../model/types";

export const signup = async (signupData: SignupFormValues) => {
  return serverFetcher.post("/auth/signup", signupData);
};
