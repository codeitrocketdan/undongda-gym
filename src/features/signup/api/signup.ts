import { clientFetcher } from "@/shared/api/clientFetcher";
import { SignupFormValues } from "../model/types";

export const signup = async (signupData: SignupFormValues) => {
  console.log(signupData);
  return await clientFetcher.post("/api/auth/signup", signupData);
};
