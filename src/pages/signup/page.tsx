"use client";
import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import Link from "next/link";

const fields = [
  { label: "이름", type: "text" },
  { label: "아이디", type: "text" },
  { label: "비밀번호", type: "password" },
  { label: "비밀번호 확인", type: "password" },
];

const SignupPage = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section
        aria-labelledby="signup-title"
        className="mx-4 w-142 max-w-142 rounded-[40px] bg-white px-14 py-10"
      >
        <h1 className="text-base-semibold md:text-2xl-semibold mb-10 text-center">회원가입</h1>
        <form className="mb-8 md:mb-10">
          <div className="mb-6">
            <InputField label="이름" htmlFor="name" required className="mb-6 md:mb-4">
              <Input id="name" placeholder="이름을 입력해주세요" />
            </InputField>
            <InputField label="아이디" htmlFor="id" required className="mb-6 md:mb-4">
              <Input id="id" placeholder="이름을 입력해주세요" />
            </InputField>
            <InputField label="비밀번호" htmlFor="password" required className="mb-6 md:mb-4">
              <Input id="password" placeholder="이름을 입력해주세요" />
            </InputField>
            <InputField label="비밀번호 확인" htmlFor="passwordConfirm" required>
              <Input id="passwordConfirm" placeholder="이름을 입력해주세요" />
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
