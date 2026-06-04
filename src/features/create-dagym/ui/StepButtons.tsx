import Button from "@/shared/ui/button/Button";

interface StepButtonsProps {
  formId: string;
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  isNextDisabled: boolean;
  onSubmit: () => void;
}

export default function StepButtons({
  formId,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onClose,
  isNextDisabled,
  onSubmit,
}: StepButtonsProps) {
  const isLastStep = currentStep === totalSteps;
  return (
    <div className="flex w-full justify-between gap-4">
      {currentStep > 1 ? (
        <Button variant="secondary" onClick={onPrev}>
          이전
        </Button>
      ) : (
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>
      )}

      {isLastStep ? (
        <Button
          variant="primary"
          type="button"
          form={formId}
          onClick={onSubmit}
          isDisabled={isNextDisabled}
        >
          만들기
        </Button>
      ) : (
        <Button variant="primary" type="button" onClick={onNext} isDisabled={isNextDisabled}>
          다음
        </Button>
      )}
    </div>
  );
}
