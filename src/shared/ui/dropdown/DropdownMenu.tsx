"use client";

import { useDropdownContext } from "./Dropdown";

export default function DropdownMenu({ children }: { children: React.ReactNode }) {
  const { isOpen } = useDropdownContext();

  if (!isOpen) return null;

  return (
    <ul className="absolute left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 whitespace-nowrap md:left-auto md:right-0">
      {children}
    </ul>
  );
}
