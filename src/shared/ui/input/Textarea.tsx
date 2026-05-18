import { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={twMerge(
        "custom-scrollbar h-30 w-full resize-none rounded-xl bg-gray-50 p-3 outline-none",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
};

export default Textarea;
