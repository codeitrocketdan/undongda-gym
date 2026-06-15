"use client";
import { Modal } from "@/shared/ui/modal";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CAPACITY_MIN, TOTAL_STEPS } from "../constants";
import { DagymFormData } from "../model/types";
import { useCreateDagym } from "../model/useCreateDagym";
import SetCategories from "./SetCategories";
import SetDate from "./SetDate";
import SetDescription from "./SetDescription";
import SetInfo from "./SetInfo";
import StepButtons from "./StepButtons";

interface useModalTypeProps {
  onClose: () => void;
}

export default function CreateDagymForm({ onClose }: useModalTypeProps) {
  const [step, setStep] = useState(1);
  const { onSubmit } = useCreateDagym(onClose);

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
      capacity: CAPACITY_MIN,
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
    if (step === 1) return !currentCategories || currentCategories.length === 0;
    if (step === 2)
      return (
        !currentTitle ||
        !currentAttachedImage ||
        !currentRegion ||
        (currentRegion === "지점 외 장소" && !currentAddress)
      );
    if (step === 3) return !currentdescription;
    if (step === 4) return !currentDateTime || !currentCapacity;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };
  return (
    <FormProvider {...methods}>
      <Modal onClose={onClose}>
        <Modal.Header className="flex-row justify-between">
          <p className="text-lg-bold">
            다짐 만들기 <span className="text-gray-800">{step}</span>
            <span className="text-gray-600">/ {TOTAL_STEPS}</span>
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
            totalSteps={TOTAL_STEPS}
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
