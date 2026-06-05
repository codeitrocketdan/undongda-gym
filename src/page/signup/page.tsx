import { SocialLoginButtons } from "@/features/auth/components/SocialLoginButtons";
import { SignupForm } from "@/features/signup";

import Link from "next/link";

const SignupPage = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        aria-labelledby="signup-title"
        className="mx-4 w-142 max-w-142 rounded-[40px] bg-white px-14 py-10"
      >
        <h1
          id="signup-title"
          className="text-base-semibold md:text-2xl-semibold mb-10 text-center"
        >
          회원가입
        </h1>
        <SignupForm />
        <div className="mb-6 flex items-center gap-2">
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300"></span>
          <p className="text-sm-medium text-gray-500">SNS 계정으로 회원가입</p>
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300"></span>
        </div>

        <SocialLoginButtons />
        <div className="text-center">
          <p className="text-[15px] font-medium text-gray-800">
            이미 회원이신가요?
            <Link
              href="/login"
              className="ml-1 font-semibold text-blue-600 underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
