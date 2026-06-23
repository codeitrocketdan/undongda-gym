"use client";
import useScrollLock from "@/shared/hooks/useScrollLock";
import { createContext, ReactNode, useContext } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { useMounted } from "../../hooks/useMounted";
import { useFocusTrap } from "../../lib/useFocusTrap";
import ModalBackground from "./Background";
import ModalBody from "./Body";
import CloseButton from "./CloseButton";
import ModalFooter from "./Footer";
import ModalHeader from "./Header";

const SIZE_CLASSES = {
  default: "max-w-136 xs:p-12 px-6 py-8",
  sm: "max-w-86 p-6",
} as const;

type ModalSize = keyof typeof SIZE_CLASSES;

interface ModalComponent extends React.FC<ModalProps> {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  CloseButton: typeof CloseButton;
}

const ModalContext = createContext<{
  onClose: () => void;
  size: ModalSize;
} | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("Modal 서브 컴포넌트는 Modal 안에서만 쓰여야 함");
  return context;
};

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  isClickToClose?: boolean;
  size?: ModalSize;
}

const Modal = ({
  children,
  onClose,
  isClickToClose,
  size = "default",
}: ModalProps) => {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const mounted = useMounted();

  useScrollLock(true);

  if (!mounted) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose, size }}>
      <ModalBackground isClickToClose={isClickToClose}>
        <div
          ref={trapRef}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          onClick={(e) => e.stopPropagation()}
          className={twMerge(
            "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white",
            SIZE_CLASSES[size]
          )}
        >
          {children}
        </div>
      </ModalBackground>
    </ModalContext.Provider>,
    document.body
  );
};

(Modal as ModalComponent).Header = ModalHeader;
(Modal as ModalComponent).Body = ModalBody;
(Modal as ModalComponent).Footer = ModalFooter;
(Modal as ModalComponent).CloseButton = CloseButton;

export default Modal as ModalComponent;
