"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import { useRouter } from "next/navigation";
import { useMeetingFormFields } from "./useMeetingFormFields";
import { useMeetingMutation } from "./useMeetingMutation";

export function useAdminCreateViewModel() {
  const router = useRouter();
  const form = useMeetingFormFields();

  const { submitError, isSubmitting, submit } = useMeetingMutation(
    (payload) => clientFetcher.post("/api/meetings", payload),
    "다짐 생성에 실패했습니다.",
    () => router.push("/admin/dagyms")
  );

  return {
    ...form,
    isSubmitting,
    submitError,
    handleSubmit: () => submit(form.buildPayload),
  };
}
