"use client";

import { SocialLoginButtons } from "@/features/auth/components/SocialLoginButtons";
import { loginSchema } from "@/features/login/model/chema";
import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import PasswordInput from "@/shared/ui/input/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const FORM_FIELDS = [
  {
    name: "email" as const,
    label: "이메일",
    type: "email",
    placeholder: "아이디를 입력해주세요.",
  },
  {
    name: "password" as const,
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력해주세요.",
  },
] as const;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, disabled },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        aria-labelledby="login-title"
        className="mx-4 w-142 max-w-142 rounded-[40px] bg-white px-4 py-10 md:px-14"
      >
        <h1 id="login-title" className="text-base-semibold md:text-2xl-semibold mb-10 text-center">
          로그인
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 space-y-6 md:space-y-4">
            {FORM_FIELDS.map((field) => (
              <InputField
                key={field.name}
                label={field.label}
                htmlFor={field.name}
                error={errors[field.name]?.message}
                required
              >
                {field.type === "password" ? (
                  <PasswordInput
                    id={field.name}
                    placeholder={field.placeholder}
                    error={!!errors[field.name]}
                    register={register(field.name)}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    error={!!errors[field.name]}
                    {...register(field.name)}
                  />
                )}
              </InputField>
            ))}
          </div>

          <Button variant="primary" isDisabled={disabled}>
            로그인
          </Button>
        </form>

        <div className="mt-8 mb-6 flex items-center gap-2">
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300" />
          <p className="text-sm-medium text-gray-500">SNS 계정으로 로그인</p>
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300" />
        </div>
        <SocialLoginButtons />
        <div className="text-center">
          <p className="text-[15px] font-medium text-gray-800">
            운동다짐이 처음이신가요?
            <Link href="/signup" className="ml-1 font-semibold text-blue-600 underline">
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
