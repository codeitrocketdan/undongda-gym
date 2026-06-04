"use client";
import Modal from "@/shared/ui/modal/Modal";
import { useModal } from "@/shared/ui/modal/useModal";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { uploadImageToStorage } from "../lib/uploadImage";
import SetCategories from "./SetCategories";
import SetDate from "./SetDate";
import SetDescription from "./SetDescription";
import SetInfo from "./SetInfo";
import StepButtons from "./StepButtons";

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

export default function CreateDagymForm() {
  const modal = useModal();
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
      capacity: 2,
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
  //console.log("와치", watch());

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

  //   const [formData, setFormData] = useState({
  //v     name: "달램핏 모임",
  //v     type: "달램핏", -> category??
  //v     region: "서울 강남구",
  //v     address: "스타벅스 강남역점, 서울 강남구 강남대로 390, 3층",
  //     latitude: 37.4979,
  //     longitude: 127.0276,
  //v     dateTime: "2026-02-01T14:00:00.000Z",
  //v     registrationEnd: "2026-01-31T23:59:59.000Z",
  //v     capacity: 20,
  //     image: "https://example.com/image.jpg",
  //v     description: "함께 운동하며 건강을 챙겨요!",
  //   });

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
    try {
      let finalImageUrl = "";
      if (data.image) {
        console.log("스토리지 이미지 업로드 시작...");
        finalImageUrl = await uploadImageToStorage({ file: data.image });
        console.log("스토리지 이미지 업로드 성공! URL:", finalImageUrl);
      }

      const submitData = {
        type: data.type,
        name: data.name,
        region: data.region,
        address: data.address,
        addressDetail: data.addressDetail,
        latitude: data.latitude,
        longitude: data.longitude,
        image: finalImageUrl, // File 객체 대신 최종 발급받은 publicUrl 주소 대입!
        description: data.description,
        dateTime: data.dateTime,
        registrationEnd: data.registrationEnd,
        capacity: data.capacity,
      };

      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON 전송 명시
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`서버 에러 발생: ${response.status}`);
      }
      const result = await response.json();
      console.log("다짐 생성 최종 성공!", result);
      modal.close(); // 성공 시 모달 닫기 추가
    } catch (error) {
      console.error("최종 생성 실패:", error);
      alert("다짐 생성 중 오류가 발생했습니다.");
    }
  };
  return (
    <FormProvider {...methods}>
      <Modal onClose={modal.close}>
        <Modal.Header className="flex-row justify-between">
          <p className="text-lg-bold">
            다짐 만들기 <span className="text-gray-800">{step}</span>
            <span className="text-gray-600">/ {totalSteps}</span>
          </p>
          <Modal.CloseButton />
        </Modal.Header>
        <main>
          <form id="meeting-multi-step-form" onSubmit={methods.handleSubmit(onSubmit)}>
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
            onClose={modal.close}
            isNextDisabled={isNextDisabled()}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        </Modal.Footer>
      </Modal>
    </FormProvider>
  );
}
