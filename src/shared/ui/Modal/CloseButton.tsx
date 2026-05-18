import { X } from "lucide-react";
import { useModalContext } from "./Modal";

interface Props {
  className?: string;
}

export default function CloseButton({ className }: Props) {
  // 내부 컴포넌트에서는 context 사용
  const { onClose } = useModalContext();
  return (
    <button className={`${className} self-end`} onClick={onClose}>
      <X />
    </button>
  );
}
