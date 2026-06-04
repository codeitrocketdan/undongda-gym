import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeader({ children, className }: HeaderProps) {
<<<<<<< feat/#48/create-dagym
  return <div className={`modal-header mb-12 flex flex-col ${className ?? ""}`}>{children}</div>;
=======
  return <div className={`modal-header flex flex-col ${className ?? ""}`}>{children}</div>;
>>>>>>> dev
}
