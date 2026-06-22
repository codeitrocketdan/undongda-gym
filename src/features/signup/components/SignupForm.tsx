"use client";

import { FORM_FIELDS } from "../model/formFields";
import { useSignupForm } from "../model/useSignupForm";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import PasswordInput from "@/shared/ui/input/PasswordInput";
import SignupSuccessModal from "@/shared/ui/modal/SignupSuccessModal";

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    modal,
  } = useSignupForm();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 md:mb-10">
        <div className="space-y-6">
          {FORM_FIELDS.map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              htmlFor={field.name}
              error={errors[field.name]?.message}
              required
            >
              {field.type === "password" ? (
                <PasswordInput
                  id={field.name}
                  placeholder={field.placeholder}
                  error={!!errors[field.name]}
                  register={register(field.name)}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  error={!!errors[field.name]}
                />
              )}
            </InputField>
          ))}
        </div>

        <Button type="submit" variant="primary" className="mt-6">
          회원가입
        </Button>
      </form>
      {modal.isOpen && <SignupSuccessModal onClose={modal.close} />}
    </>
  );
};
