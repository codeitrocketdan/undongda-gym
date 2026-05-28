"use client";

import { useDropdownContext } from "./Dropdown";

export default function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const { toggle } = useDropdownContext();

  return (
    <div onClick={toggle} role="button">
      {children}
    </div>
  );
}
