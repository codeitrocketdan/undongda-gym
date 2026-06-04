export const FORM_FIELDS = [
  {
    name: "name",
    label: "이름",
    type: "text",
    placeholder: "이름을 입력해주세요",
  },
  {
    name: "email",
    label: "아이디",
    type: "email",
    placeholder: "아이디를 입력해주세요",
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
