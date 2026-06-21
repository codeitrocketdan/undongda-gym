"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { login } from "../api/login";
import { loginSchema } from "./schema";
import { LoginFormValues } from "./types";

export const useLoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (loginData) => {
    try {
      await login(loginData);

      await queryClient.invalidateQueries();

      router.replace("/");
      router.refresh();
    } catch (error) {
      form.setError("root", {
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }
  };

  return {
    ...form,
    onSubmit,
  };
};
