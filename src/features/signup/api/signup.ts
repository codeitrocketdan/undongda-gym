import { post } from "@/shared/lib/fetch";
import { SignupFormValues } from "../model/types";

export const signup = async (signupData: SignupFormValues) => {
  return post("/auth/signup", signupData);
};
