"use client";
import { Modal } from "@/shared/ui/Modal";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { uploadImageToStorage } from "../lib/uploadImage";
import SetCategories from "./SetCategories";
import SetDate from "./SetDate";
import SetDescription from "./SetDescription";
import SetInfo from "./SetInfo";
import StepButtons from "./StepButtons";

interface useModalTypeProps {
  onClose: () => void;
}
interface DagymFormData {
  type: string;
  name: string;
  region: string;
  address: string;
  addressDetail: string;
  latitude: number | null;
  longitude: number | null;
  image: File | null;
  description: string;
  dateTime: Date;
  registrationEnd: Date;
  capacity: number;
}

export default function CreateDagymForm({ onClose }: useModalTypeProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const methods = useForm<DagymFormData>({
    defaultValues: {
      type: "",
      name: "",
      region: "",
      address: "",
      addressDetail: "",
      latitude: null,
      longitude: null,
      image: null,
      description: "",
      dateTime: undefined,
      registrationEnd: undefined,
      capacity: 3,
    },
  });
  const { watch } = methods;

  const currentCategories = watch("type");
  const currentTitle = watch("name");
  const currentRegion = watch("region");
  const currentAddress = watch("address");
  const currentAttachedImage = watch("image");
  const currentdescription = watch("description");
  const currentDateTime = watch("dateTime");
  const currentCapacity = watch("capacity");

  const isNextDisabled = () => {
    if (step === 1) {
      return !currentCategories || currentCategories.length === 0;
    }
    if (step === 2) {
      return (
        !currentTitle ||
        !currentAttachedImage ||
        !currentRegion ||
        (currentRegion === "지점 외 장소" && !currentAddress)
      );
    }
    if (step === 3) {
      return !currentdescription;
    }
    if (step === 4) {
      return !currentDateTime || !currentCapacity;
    }

    return false; // 기본값은 활성화
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: DagymFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      let finalImageUrl = "";
      if (data.image) {
        finalImageUrl = await uploadImageToStorage({ file: data.image });
      }

      const submitData = {
        type: data.type,
        name: data.name,
        region: data.region,
        address: data.address,
        addressDetail: data.addressDetail,
        latitude: data.latitude ? Number(data.latitude) : 37.4979,
        longitude: data.longitude ? Number(data.longitude) : 127.0276,
        image: finalImageUrl, // File 객체 대신 최종 발급받은 publicUrl 주소 대입
        description: data.description,
        dateTime: data.dateTime,
        registrationEnd: data.registrationEnd,
        capacity: data.capacity,
      };

      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON 전송 명시
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`서버 에러 발생: ${response.status}`);
      }
      const result = await response.json();
      console.log("다짐 생성 최종 성공!", result);
      onClose(); // 성공 시 모달 닫기 추가
    } catch (error) {
      console.error("최종 생성 실패:", error);
      alert("다짐 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <Modal onClose={onClose}>
        <Modal.Header className="flex-row justify-between">
          <p className="text-lg-bold">
            다짐 만들기 <span className="text-gray-800">{step}</span>
            <span className="text-gray-600">/ {totalSteps}</span>
          </p>
          <Modal.CloseButton />
        </Modal.Header>
        <main>
          <form
            id="meeting-multi-step-form"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {step === 1 && <SetCategories />}
            {step === 2 && <SetInfo />}
            {step === 3 && <SetDescription />}
            {step === 4 && <SetDate />}
          </form>
        </main>
        <Modal.Footer>
          <StepButtons
            formId="meeting-multi-step-form"
            currentStep={step}
            totalSteps={totalSteps}
            onPrev={handlePrev}
            onNext={handleNext}
            onClose={onClose}
            isNextDisabled={isNextDisabled()}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        </Modal.Footer>
      </Modal>
    </FormProvider>
  );
}
