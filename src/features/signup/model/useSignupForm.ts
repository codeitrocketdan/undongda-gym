import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { ApiError } from "@/shared/api/types";
import { useModal } from "@/shared/ui/modal";
import { useQueryClient } from "@tanstack/react-query";
import { signup } from "../api/signup";
import { signupSchema } from "./schema";
import { SignupFormValues } from "./types";

export const useSignupForm = () => {
  const queryClient = useQueryClient();
  const modal = useModal();
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
      modal.open();
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
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
    modal,
  };
};
