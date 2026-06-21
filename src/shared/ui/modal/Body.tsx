"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

export default function ModalBody({ children, className }: BodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const checkScroll = () => {
      setHasScroll(el.scrollHeight > el.clientHeight);
    };

    checkScroll();

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [children]);

  return (
    <div
      ref={bodyRef}
      style={{ paddingRight: hasScroll ? 10 : 0 }}
      className={twMerge(
        "modal-body custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
