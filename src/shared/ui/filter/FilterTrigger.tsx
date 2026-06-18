"use client";

import { useDropdownContext } from "@/shared/ui/dropdown/Dropdown";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FilterTrigger({ label }: { label?: string }) {
  const { isOpen } = useDropdownContext();
  return (
    <button
      type="button"
      className="md:text-base-medium flex cursor-pointer items-center gap-1 text-sm whitespace-nowrap text-slate-600 hover:text-slate-900"
    >
      {label}
      {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
    </button>
  );
}
