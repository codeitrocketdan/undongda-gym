"use client";
import { SocialLoginButtons } from "@/features/auth/components/SocialLoginButtons";
import { FORM_FIELDS } from "@/features/signup/model/formFields";
import { signupSchema } from "@/features/signup/model/schema";
import { post } from "@/shared/lib/fetch";
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
      await post("/auth/signup", signupData);
      alert("회원가입이 완료되었습니다.");
      router.replace("/");
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        message?: string;
      };

      if (err.status === 409) {
        alert(err.message ?? "이미 사용 중인 이메일입니다.");
        return;
      }

      alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
        <SocialLoginButtons />
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
