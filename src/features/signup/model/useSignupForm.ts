import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { login } from "@/features/login/api/login";
import { ApiError } from "@/shared/api/types";
import { useQueryClient } from "@tanstack/react-query";
import { signup } from "../api/signup";
import { signupSchema } from "./schema";
import { SignupFormValues } from "./types";

export const useSignupForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      await login({
        email: signupData.email,
        password: signupData.password,
      });
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      router.replace("/");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          form.setError("email", {
            type: "server",
            message: "이미 사용 중인 이메일입니다.",
          });

          return;
        }

        form.setError("root", {
          type: "server",
          message: error.message,
        });

        return;
      }

      form.setError("root", {
        type: "server",
        message: "회원가입 중 오류가 발생했습니다.",
      });
    }
  };

  return {
    ...form,
    onSubmit,
  };
};
