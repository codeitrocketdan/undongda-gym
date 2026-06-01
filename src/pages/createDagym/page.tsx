"use client";
import Modal from "@/shared/ui/modal/Modal";
import { useModal } from "@/shared/ui/modal/useModal";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import SetCategories from "./SetCategories";
import SetDate from "./SetDate";
import SetDescribe from "./SetDescribe";
import SetInfo from "./SetInfo";
import StepButtons from "./StepButtons";

interface DagymFormData {
  title: string;
  address: string;
  detailAddress: string;
  selectedImage: File | null;
  description: string;
}

export default function CreateDagymPage() {
  const modal = useModal();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const methods = useForm<DagymFormData>({
    defaultValues: {
      title: "",
      address: "",
      detailAddress: "",
      selectedImage: null,
      description: "",
    },
  });

  //   const [formData, setFormData] = useState({
  //     name: "달램핏 모임",
  //     type: "달램핏",
  //     region: "서울 강남구",
  //     address: "스타벅스 강남역점, 서울 강남구 강남대로 390, 3층",
  //     latitude: 37.4979,
  //     longitude: 127.0276,
  //     dateTime: "2026-02-01T14:00:00.000Z",
  //     registrationEnd: "2026-01-31T23:59:59.000Z",
  //     capacity: 20,
  //     image: "https://example.com/image.jpg",
  //     description: "함께 운동하며 건강을 챙겨요!",
  //   });

  const handleCancel = () => {};
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
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("address", data.address);
    formData.append("detailAddress", data.detailAddress);

    if (data.selectedImage) {
      formData.append("image", data.selectedImage);
    }

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`서버 에러 발생: ${response.status}`);
      }
      const result = await response.json();
      console.log("업로드 성공!", result);
    } catch (error) {
      console.error("업로드 실패", error);
    }
  };
  return (
    <FormProvider {...methods}>
      <Modal onClose={modal.close}>
        <Modal.Header>
          <p className="text-lg-bold">
            모임 만들기 <span className="text-gray-800">{step}</span>
            <span className="text-gray-600">/ {totalSteps}</span>
          </p>
          <Modal.CloseButton />
        </Modal.Header>
        <main>
          <form id="meeting-multi-step-form" onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 1 && <SetCategories />}
            {step === 2 && <SetInfo />}
            {step === 3 && <SetDescribe />}
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
          />
        </Modal.Footer>
      </Modal>
    </FormProvider>
  );
}
