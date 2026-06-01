interface StepButtonsProps {
  formId: string; // 💡 여기에 타입을 추가해 줍니다!
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function StepButtons({
  formId,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
}: StepButtonsProps) {
  const isLastStep = currentStep === totalSteps;
  return (
    <div className="flex w-full justify-between">
      {currentStep > 1 ? (
        <button type="button" onClick={onPrev}>
          이전
        </button>
      ) : (
        <div />
      )}

      {isLastStep ? (
        <button type="submit" form={formId} className="rounded-xl bg-teal-500 px-6 py-2 text-white">
          만들기
        </button>
      ) : (
        <button type="button" onClick={onNext}>
          다음
        </button>
      )}
    </div>
  );
}
