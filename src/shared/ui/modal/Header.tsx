import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeader({ children, className }: HeaderProps) {
  return (
    <div
      className={twMerge(`modal-header mb-12 flex flex-col ${className ?? ""}`)}
    >
      {children}
    </div>
  );
}
