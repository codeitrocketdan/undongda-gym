export const FORM_FIELDS = [
  {
    name: "email" as const,
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력해주세요.",
  },
  {
    name: "password" as const,
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력해주세요.",
  },
] as const;
