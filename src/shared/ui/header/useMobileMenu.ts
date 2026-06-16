import useScrollLock from "@/shared/hooks/useScrollLock";
import { useState } from "react";

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  useScrollLock(isOpen);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
