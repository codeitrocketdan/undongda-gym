"use client";
import Input from "@/shared/ui/input/Input";
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
    formState: { errors },
  } = useForm<Inputs>();
  console.log(errors);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="email"
        id="email"
        error={!!errors.email}
        {...register("email", { required: "아이디를 입력해주세요." })}
        placeholder="아이디를 입력해주세요."
      />
      <p>{errors.email?.message}</p>
      <Input
        type="password"
        id="password"
        error={!!errors.password}
        {...register("password", { required: "비밀번호를 입력해주세요." })}
        placeholder="비밀번호를 입력해주세요."
      />
      <p>{errors.password?.message}</p>
      <button type="submit">버튼</button>
    </form>
  );
};

export default LoginPage;
