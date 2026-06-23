"use client";
import { ErrorModal, Modal } from "@/shared/ui/modal";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CAPACITY_MIN, DAGYM_STEP, TOTAL_STEPS } from "../constants";
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
  const { onSubmit, errorMessage, clearError } = useCreateDagym(onClose);

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
  const currentLatitude = watch("latitude");
  const currentLongitude = watch("longitude");
  const currentdescription = watch("description");
  const currentDateTime = watch("dateTime");
  const currentCapacity = watch("capacity");

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!(currentAttachedImage instanceof File)) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(currentAttachedImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [currentAttachedImage]);

  const isNextDisabled = () => {
    if (step === DAGYM_STEP.CATEGORY)
      return !currentCategories || currentCategories.length === 0;
    if (step === DAGYM_STEP.INFO)
      return (
        !currentTitle ||
        !currentAttachedImage ||
        !currentRegion ||
        (currentRegion === "지점 외 장소" &&
          (!currentAddress || !currentLatitude || !currentLongitude))
      );
    if (step === DAGYM_STEP.DESCRIPTION) return !currentdescription;
    if (step === DAGYM_STEP.DATE) return !currentDateTime || !currentCapacity;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (step > DAGYM_STEP.CATEGORY) setStep((prev) => prev - 1);
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
        <Modal.Body>
          <form
            id="meeting-multi-step-form"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {step === DAGYM_STEP.CATEGORY && <SetCategories />}
            {step === DAGYM_STEP.INFO && (
              <SetInfo imagePreview={imagePreview} />
            )}
            {step === DAGYM_STEP.DESCRIPTION && <SetDescription />}
            {step === DAGYM_STEP.DATE && <SetDate />}
          </form>
        </Modal.Body>
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
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={clearError} />
      )}
    </FormProvider>
  );
}
