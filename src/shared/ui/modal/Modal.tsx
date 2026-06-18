"use client";
import useScrollLock from "@/shared/hooks/useScrollLock";
import { createContext, ReactNode, useContext } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "../../hooks/useMounted";
import { useFocusTrap } from "../../lib/useFocusTrap";
import ModalBackground from "./Background";
import CloseButton from "./CloseButton";
import ModalFooter from "./Footer";
import ModalHeader from "./Header";

interface ModalComponent extends React.FC<ModalProps> {
  Header: typeof ModalHeader;
  Footer: typeof ModalFooter;
  CloseButton: typeof CloseButton;
}

const ModalContext = createContext<{ onClose: () => void } | null>(null);

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
}

const Modal = ({ children, onClose, isClickToClose }: ModalProps) => {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const mounted = useMounted();

  useScrollLock(true);

  if (!mounted) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <ModalBackground isClickToClose={isClickToClose}>
        <div
          ref={trapRef}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-136 max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white"
        >
          <div className="xs:p-12 min-h-0 flex-1 overflow-y-auto px-6 py-8">
            {children}
          </div>
        </div>
      </ModalBackground>
    </ModalContext.Provider>,
    document.body
  );
};

(Modal as ModalComponent).Header = ModalHeader;
(Modal as ModalComponent).Footer = ModalFooter;
(Modal as ModalComponent).CloseButton = CloseButton;

export default Modal as ModalComponent;
