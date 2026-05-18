"use client";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, disabled },
  } = useForm<Inputs>();
  console.log(errors);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    setTimeout(() => {
      console.log("로그인");
    }, 3000);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField label="이메일" htmlFor="email" error={errors.email?.message} required>
        <Input
          type="email"
          id="email"
          error={!!errors.email}
          placeholder="아이디를 입력해주세요."
          {...register("email", {
            required: "아이디를 입력해주세요.",
          })}
        />
      </InputField>
      <InputField label="비밀번호" htmlFor="password" error={errors.password?.message}>
        <Input
          type="password"
          id="password"
          error={!!errors.password}
          placeholder="비밀번호를 입력해주세요."
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
          })}
        />
      </InputField>
      <InputField>
        <textarea className="custom-scrollbar resize-none rounded-xl bg-gray-50 p-3 outline-none" />
      </InputField>
      <button type="submit" disabled={disabled} className={disabled ? "bg-red-50" : ""}>
        버튼
      </button>
    </form>
  );
};

export default LoginPage;
