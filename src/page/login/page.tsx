import { SocialLoginButtons } from "@/features/auth/components/SocialLoginButtons";
import { LoginForm } from "@/features/login";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        aria-labelledby="login-title"
        className="mx-4 w-142 max-w-142 rounded-[40px] bg-white px-4 py-10 md:px-14"
      >
        <h1
          id="login-title"
          className="text-base-semibold md:text-2xl-semibold mb-10 text-center"
        >
          로그인
        </h1>
        <LoginForm />
        <div className="mt-8 mb-6 flex items-center gap-2">
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300" />
          <p className="text-sm-medium text-gray-500">SNS 계정으로 로그인</p>
          <span aria-hidden="true" className="h-px flex-1 bg-gray-300" />
        </div>
        <SocialLoginButtons />
        <div className="text-center">
          <p className="text-[15px] font-medium text-gray-800">
            운동다짐이 처음이신가요?
            <Link
              href="/signup"
              className="ml-1 font-semibold text-blue-600 underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
