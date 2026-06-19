"use client";

import Button from "@/shared/ui/button/Button";
import { useAdminCreateViewModel } from "../model/useAdminCreateViewModel";
import MeetingFormFields from "./MeetingFormFields";

export default function CreateMeetingForm() {
  const {
    isValid,
    isSubmitting,
    submitError,
    handleSubmit,
    ...fields
  } = useAdminCreateViewModel();

  return (
    <div className="max-w-xl rounded-2xl bg-white p-8 shadow-sm">
      <MeetingFormFields {...fields} />

      {submitError && (
        <p className="mb-3 text-sm text-red-500">{submitError}</p>
      )}

      <Button
        className="mt-2"
        onClick={handleSubmit}
        isDisabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "생성 중..." : "다짐 만들기"}
      </Button>
    </div>
  );
}
