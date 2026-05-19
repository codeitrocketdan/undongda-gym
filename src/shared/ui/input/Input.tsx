import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

// InputHTMLAttributes<HTMLInputElement>를 사용해서 input의 속성을 받습니다.
interface PropsType extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

// interface PropsType {

// }

const Input = ({ className, error, ...props }: PropsType) => {
  return (
    <input
      className={twMerge(
        "w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none",
        "placeholder:text-gray-400",
        error ? "border-error-100" : "focus:border-blue-500",
        className
      )}
      {...props}
    />
  );
};

export default Input;
