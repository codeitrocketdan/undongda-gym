"use client";
import { ApiError } from "@/shared/api/types";
import { meetingQueries, userMeetingQueries } from "@/shared/lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { createMeeting } from "../api";
import { uploadImageToStorage } from "../lib/uploadImage";
import { DagymFormData } from "./types";

export function useCreateDagym(onClose: () => void) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // useRef 기반 락 사용으로 대체
  const submitLockRef = useRef(false);

  const onSubmit = async (data: DagymFormData) => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    try {
      setIsSubmitting(true);

      let finalImageUrl = "";
      if (data.image) {
        finalImageUrl = await uploadImageToStorage({ file: data.image });
      }

      await createMeeting({
        type: data.type,
        name: data.name,
        region: data.region,
        address: data.address,
        addressDetail: data.addressDetail,
        latitude: data.latitude ?? 37.4979,
        longitude: data.longitude ?? 127.0276,
        image: finalImageUrl,
        description: data.description,
        dateTime: data.dateTime,
        registrationEnd: data.registrationEnd,
        capacity: data.capacity,
      });

      queryClient.invalidateQueries({ queryKey: meetingQueries.all });
      queryClient.invalidateQueries({ queryKey: userMeetingQueries.all });

      onClose();
    } catch (error) {
      console.error("최종 생성 실패:", error);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "다짐 생성 중 오류가 발생했습니다."
      );
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errorMessage,
    clearError: () => setErrorMessage(""),
    onSubmit,
  };
}
