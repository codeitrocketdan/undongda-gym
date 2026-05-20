"use client";

import Input from "@/shared/ui/input/Input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  id: string;
  placeholder?: string;
  error?: boolean;
  register: UseFormRegisterReturn;
}

const PasswordInput = ({ id, placeholder, error, register }: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        error={error}
        {...register}
      />

      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-800"
      >
        {show ? <Eye size={22} /> : <EyeOff size={22} />}
      </button>
    </div>
  );
};

export default PasswordInput;
