import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

// InputHTMLAttributes<HTMLInputElement>를 사용해서 input의 속성을 받습니다.
interface PropsType extends InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "password" | "submit" | "reset" | "number" | "email";
  id: string;
  className?: string;
  error?: boolean;
}

const Input = ({ type, id, className, error, ...props }: PropsType) => {
  return (
    <input
      type={type}
      id={id}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error}
      className={twMerge(
        "w-full rounded-xl bg-gray-50 p-3 outline-none",
        "border border-transparent",
        !error && "focus:border-blue-500",
        error && "border-error-100",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
};

export default Input;
