import React from "react";
import { twMerge } from "tailwind-merge";

interface PropsType {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

const InputField = ({ label, htmlFor, error, children, required, className }: PropsType) => {
  return (
    <div className={twMerge("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={twMerge(
            "text-sm-medium ml-1 text-gray-800",
            required && "after:ml-1 after:text-blue-500 after:content-['*']"
          )}
        >
          {label}
        </label>
      )}

      {children}

      {error && <p className="ml-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
