import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useModalContext } from "./Modal";

interface Props {
  className?: string;
}

export default function CloseButton({ className }: Props) {
  // 내부 컴포넌트에서는 context 사용
  const { onClose } = useModalContext();
  return (
    <button
      type="button"
      className={twMerge("cursor-pointer self-end", className)}
      onClick={onClose}
    >
      <X />
    </button>
  );
}
