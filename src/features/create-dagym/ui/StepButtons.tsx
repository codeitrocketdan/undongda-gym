import Button from "@/shared/ui/button/Button";

interface StepButtonsProps {
  formId: string; // 💡 여기에 타입을 추가해 줍니다!
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  isNextDisabled: boolean;
}

export default function StepButtons({
  formId,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onClose,
  isNextDisabled,
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
        <Button variant="primary" type="submit" form={formId}>
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
