import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

export default function ModalBody({ children, className }: BodyProps) {
  return (
    <div
      className={twMerge(
        "modal-body custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
