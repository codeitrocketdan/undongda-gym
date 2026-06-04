import { ReactNode } from "react";

export default function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="modal-footer mt-14 flex justify-between gap-2">{children}</div>;
}
