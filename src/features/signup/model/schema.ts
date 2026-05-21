import z from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "이름은 2자 이상 입력해주세요.")
      .max(8, "이름은 8자 이하로 입력해주세요.")
      .regex(/^[a-zA-Z0-9가-힣]+$/, "닉네임은 한글, 영문, 숫자만 가능합니다."),
    email: z
      .email("이메일 형식이 아닙니다.")
      .min(1, "이메일을 입력해주세요.")
      .max(50, "이메일은 50자 이하로 입력해주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상 입력해주세요.")
      .max(20, "비밀번호는 20자 이하로 입력해주세요.")
      .regex(
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()._-])[a-zA-Z0-9!@#$%^&*()._-]+$/,
        "영문, 숫자, 특수문자를 포함해주세요."
      ),
    passwordConfirm: z.string().min(1, "비밀번호를 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
