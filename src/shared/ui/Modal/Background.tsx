import { ReactNode } from "react";
import { useModalContext } from "./Modal";

interface ModalBackgroundProps {
  children: ReactNode;
  isClickToClose?: boolean;
}

export default function ModalBackground({
  children,
  isClickToClose = false,
}: ModalBackgroundProps) {
  const { onClose } = useModalContext();
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isClickToClose) return;

    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      onClick={handleBackgroundClick}
      className="bg-close fixed top-0 left-0 flex h-screen w-full items-center justify-center bg-black/50"
    >
      {children}
    </div>
  );
}
