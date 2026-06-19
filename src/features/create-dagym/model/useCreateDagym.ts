"use client";
import { useRef, useState } from "react";
import { createMeeting } from "../api";
import { uploadImageToStorage } from "../lib/uploadImage";
import { DagymFormData } from "./types";

export function useCreateDagym(onClose: () => void) {
  // TODO - UI에서 제출 중 버튼 비활성화/로딩 표시용으로 사용 가능 (미사용 시 제거 가능)
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      onClose();
    } catch (error) {
      console.error("최종 생성 실패:", error);
      alert("다짐 생성 중 오류가 발생했습니다.");
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, onSubmit };
}
