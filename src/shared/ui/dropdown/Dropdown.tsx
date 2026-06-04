"use client";

import { useDropdown } from "@/shared/hooks/useDropdown";
import { createContext, useContext } from "react";
import DropdownItem from "./DropdownItem";
import DropdownMenu from "./DropdownMenu";
import DropdownTrigger from "./DropdownTrigger";

interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("Dropdown 컴포넌트안에서 사용해야 합니다.");
  return context;
}

function Dropdown({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle, close, wrapperRef } = useDropdown();

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={wrapperRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export default Object.assign(Dropdown, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
});
