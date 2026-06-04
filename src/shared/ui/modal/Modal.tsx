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

// 1. 모달의 기능을 공유할 컨텍스트 생성
const ModalContext = createContext<{ onClose: () => void } | null>(null);

// 2. 자식컴포넌트에서 꺼내 쓸 수 있는 커스텀 훅
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal 서브 컴포넌트는 Modal 안에서만 쓰여야 함");
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
<<<<<<< feat/#48/create-dagym
          className="w-full max-w-136 rounded-xl bg-white p-6 sm:p-12"
=======
          className="max-w-140 min-w-85 rounded-xl bg-white p-10"
>>>>>>> dev
        >
          {children}
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
