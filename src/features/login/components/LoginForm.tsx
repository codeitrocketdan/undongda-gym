"use client";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import PasswordInput from "@/shared/ui/input/PasswordInput";

import { FORM_FIELDS } from "../model/formFields";
import { useLoginForm } from "../model/useLoginForm";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    formState: { errors, disabled },
  } = useLoginForm();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 space-y-6 md:space-y-4">
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
                  error={!!errors[field.name]}
                  {...register(field.name)}
                />
              )}
            </InputField>
          ))}
        </div>

        <Button type="submit" variant="primary" isDisabled={disabled}>
          로그인
        </Button>
      </form>

      {errors.root && (
        <p className="text-error-100 mt-4 text-center text-sm">
          {errors.root.message}
        </p>
      )}
    </>
  );
};
