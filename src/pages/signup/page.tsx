"use client";
import { signupSchema } from "@/features/signup/model/schema";
import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

interface SignupForm {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(signupSchema),
    shouldFocusError: true,
  });

  const onSignup: SubmitHandler<SignupForm> = (data) => {
    console.log(data);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        aria-labelledby="signup-title"
        className="mx-4 w-142 max-w-142 rounded-[40px] bg-white px-14 py-10"
      >
        <h1 className="text-base-semibold md:text-2xl-semibold mb-10 text-center">회원가입</h1>
        <form onSubmit={handleSubmit(onSignup)} className="mb-8 md:mb-10">
          <div className="mb-6">
            <InputField
              label="이름"
              htmlFor="nickname"
              error={errors.nickname?.message}
              required
              className="mb-6 md:mb-4"
            >
              <Input
                type="text"
                id="nickname"
                {...register("nickname")}
                placeholder="이름을 입력해주세요"
              />
            </InputField>
            <InputField
              label="아이디"
              htmlFor="email"
              error={errors.email?.message}
              required
              className="mb-6 md:mb-4"
            >
              <Input
                type="text"
                id="email"
                {...register("email")}
                placeholder="이름을 입력해주세요"
              />
            </InputField>
            <InputField
              label="비밀번호"
              htmlFor="password"
              error={errors.password?.message}
              required
              className="mb-6 md:mb-4"
            >
              <Input
                type="password"
                id="password"
                {...register("password")}
                placeholder="이름을 입력해주세요"
              />
            </InputField>
            <InputField
              label="비밀번호 확인"
              htmlFor="passwordConfirm"
              error={errors.passwordConfirm?.message}
              required
            >
              <Input
                type="password"
                id="passwordConfirm"
                {...register("passwordConfirm")}
                placeholder="이름을 입력해주세요"
              />
            </InputField>
          </div>
          <Button type="submit" variant="primary" onClick={() => console.log("test")}>
            회원가입
          </Button>
        </form>
        <div className="mb-6 flex items-center gap-2">
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300"></span>
          <p className="text-sm-medium text-gray-500">SNS 계정으로 회원가입</p>
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300"></span>
        </div>
        {/* 소셜 회원가입으로 수정 */}
        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row">
          <Button variant="secondary" onClick={() => console.log("test")}>
            구글로 계속하기
          </Button>
          <Button variant="secondary" onClick={() => console.log("test")}>
            카카오로 계속하기
          </Button>
        </div>
        <div className="text-center">
          <p className="text-[15px] font-medium text-gray-800">
            이미 회원이신가요?
            <Link href="/naver.com" className="ml-1 font-semibold text-blue-600 underline">
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
