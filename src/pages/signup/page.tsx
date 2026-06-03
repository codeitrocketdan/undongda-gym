"use client";
import { signupSchema } from "@/features/signup/model/schema";
import { apiClient, ApiError } from "@/shared/api/apiClient";
import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import PasswordInput from "@/shared/ui/input/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const FORM_FIELDS = [
  {
    name: "name" as const,
    label: "이름",
    type: "text",
    placeholder: "이름을 입력해주세요",
  },
  {
    name: "email" as const,
    label: "아이디",
    type: "text",
    placeholder: "아이디를 입력해주세요",
  },
  {
    name: "password" as const,
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력해주세요",
  },
  {
    name: "passwordConfirm" as const,
    label: "비밀번호 확인",
    type: "password",
    placeholder: "비밀번호를 다시 입력해주세요",
  },
] as const;

const SignupPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
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

  const onSignup: SubmitHandler<SignupForm> = async (signupData) => {
    try {
      await apiClient("/auth/signup", {
        method: "POST",
        body: signupData,
      });

      alert("회원가입이 완료되었습니다.");
      router.replace("/");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          alert(error.message);
        }
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        aria-labelledby="signup-title"
        className="mx-4 w-142 max-w-142 rounded-[40px] bg-white px-14 py-10"
      >
        <h1 id="signup-title" className="text-base-semibold md:text-2xl-semibold mb-10 text-center">
          회원가입
        </h1>
        <form onSubmit={handleSubmit(onSignup)} className="mb-8 md:mb-10">
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
                    {...register(field.name)}
                    error={!!errors[field.name]}
                  />
                )}
              </InputField>
            ))}
          </div>
          <Button type="submit" variant="primary">
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
            <Link href="/login" className="ml-1 font-semibold text-blue-600 underline">
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
