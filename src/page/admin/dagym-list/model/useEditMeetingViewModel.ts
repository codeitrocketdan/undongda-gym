"use client";

import { MeetingWithHostDTO } from "@/features/dagym/types";
import { useMeetingFormFields } from "@/page/admin/dagym-create/model/useMeetingFormFields";
import { useMeetingMutation } from "@/page/admin/dagym-create/model/useMeetingMutation";
import { clientFetcher } from "@/shared/api/clientFetcher";

export function useEditMeetingViewModel(
  meeting: MeetingWithHostDTO,
  onSuccess: () => void
) {
  const date = meeting.dateTime ? new Date(meeting.dateTime) : undefined;
  const time = date
    ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "";

  const form = useMeetingFormFields({
    type: meeting.type,
    name: meeting.name,
    region: meeting.region,
    image: meeting.image ?? "",
    description: meeting.description ?? "",
    date,
    time,
    capacity: meeting.capacity,
  });

  const { submitError, isSubmitting, submit } = useMeetingMutation(
    (payload) => clientFetcher.patch(`/api/meetings/${meeting.id}`, payload),
    "다짐 수정에 실패했습니다.",
    onSuccess
  );

  return {
    ...form,
    isSubmitting,
    submitError,
    handleSubmit: () => submit(form.buildPayload),
  };
}
