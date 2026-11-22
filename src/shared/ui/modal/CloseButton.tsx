import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useModalContext } from "./Modal";

interface Props {
  className?: string;
}

export default function CloseButton({ className }: Props) {
  const { onClose } = useModalContext();
  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={onClose}
    >
      <X />
    </button>
  );
}
