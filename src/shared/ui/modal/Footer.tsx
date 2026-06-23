import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useModalContext } from "./Modal";

export default function ModalFooter({ children }: { children: ReactNode }) {
  const { size } = useModalContext();

  return (
    <div
      className={twMerge(
        "modal-footer flex justify-between gap-2",
        size === "sm" ? "mt-8" : "mt-14"
      )}
    >
      {children}
    </div>
  );
}
