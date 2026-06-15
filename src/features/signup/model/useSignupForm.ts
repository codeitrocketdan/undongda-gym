import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { signup } from "../api/signup";
import { signupSchema } from "./schema";
import { SignupFormValues } from "./types";

export const useSignupForm = () => {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(signupSchema),
    shouldFocusError: true,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (signupData) => {
    try {
      await signup(signupData);

      alert("회원가입이 완료되었습니다.");

      router.replace("/");
    } catch (error) {
      const err = error as {
        status?: number;
      };

      if (err.status === 409) {
        alert("이미 사용 중인 이메일입니다.");
        return;
      }

      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return {
    ...form,
    onSubmit,
  };
};
