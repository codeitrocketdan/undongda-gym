import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface PropsType extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = ({ className, error, ...props }: PropsType) => {
  return (
    <input
      className={twMerge(
        "bg-gray-20 w-full rounded-xl border border-gray-200 p-3 outline-none",
        "placeholder:text-gray-400",
        error ? "border-error-100" : "focus:border-blue-500",
        className
      )}
      {...props}
    />
  );
};

export default Input;
