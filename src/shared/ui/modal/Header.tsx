import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useModalContext } from "./Modal";

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeader({ children, className }: HeaderProps) {
  const { size } = useModalContext();

  return (
    <div
      className={twMerge(
        "modal-header flex flex-col",
        size === "sm" ? "mb-5" : "mb-12",
        className
      )}
    >
      {children}
    </div>
  );
}
