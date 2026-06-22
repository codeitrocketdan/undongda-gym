// 이메일의 첫 두 글자와 마지막 "." 이후만 보여주고 나머지는 별표로 가린다.
// 예: "codeit@gmail.com" -> "co**********.com"
export function maskEmail(email: string): string {
  const lastDotIndex = email.lastIndexOf(".");
  if (lastDotIndex <= 2) return email;

  const prefix = email.slice(0, 2);
  const suffix = email.slice(lastDotIndex);
  const maskedLength = lastDotIndex - prefix.length;

  return `${prefix}${"*".repeat(maskedLength)}${suffix}`;
}
