import { ApiError } from "@/shared/api/types";
import { meetingQueries, userMeetingQueries } from "@/shared/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MeetingFormPayload } from "./useMeetingFormFields";

// 다짐 생성/수정 폼이 공유하는 제출 로직 (에러 처리, 쿼리 무효화, 성공 콜백)
export function useMeetingMutation(
  mutationFn: (payload: MeetingFormPayload) => Promise<unknown>,
  errorFallbackMessage: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingQueries.all });
      queryClient.invalidateQueries({ queryKey: userMeetingQueries.all });
      onSuccess();
    },
    onError: (error) => {
      setSubmitError(error instanceof ApiError ? error.message : errorFallbackMessage);
    },
  });

  const submit = (buildPayload: () => MeetingFormPayload | null) => {
    const payload = buildPayload();
    if (!payload) return;
    setSubmitError("");
    mutate(payload);
  };

  return { submitError, isSubmitting: isPending, submit };
}
