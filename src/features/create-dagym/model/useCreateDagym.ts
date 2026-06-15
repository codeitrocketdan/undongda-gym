"use client";
import { useState } from "react";
import { createMeeting } from "../api";
import { uploadImageToStorage } from "../lib/uploadImage";
import { DagymFormData } from "./types";

export function useCreateDagym(onClose: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: DagymFormData) => {
    if (isSubmitting) return;
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

      onClose();
    } catch (error) {
      console.error("최종 생성 실패:", error);
      alert("다짐 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, onSubmit };
}
