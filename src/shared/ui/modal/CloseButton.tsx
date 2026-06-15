import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useModalContext } from "./Modal";

interface Props {
  className?: string;
}

export default function CloseButton({ className }: Props) {
  const { onClose } = useModalContext();
  return (
    <button
      type="button"
      className={twMerge("cursor-pointer", className)}
      onClick={onClose}
    >
      <X />
    </button>
  );
}
