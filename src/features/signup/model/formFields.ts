export const FORM_FIELDS = [
  {
    name: "name",
    label: "닉네임",
    type: "text",
    placeholder: "닉네임을 입력해주세요",
  },
  {
    name: "email",
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력해주세요",
  },
  {
    name: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력해주세요",
  },
  {
    name: "passwordConfirm",
    label: "비밀번호 확인",
    type: "password",
    placeholder: "비밀번호를 다시 입력해주세요",
  },
] as const;
