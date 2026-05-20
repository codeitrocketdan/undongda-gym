import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeader({ children, className }: HeaderProps) {
  return <div className={`modal-header flex flex-col ${className ?? ""}`}>{children}</div>;
}
