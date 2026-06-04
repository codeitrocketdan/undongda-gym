"use client";

import Dropdown, { useDropdownContext } from "@/shared/ui/dropdown/Dropdown";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface CenterOption {
  label: string;
  value: string;
}

interface CenterFilterProps {
  options: CenterOption[];
  value?: CenterOption;
  onChange: (value: CenterOption) => void;
}

function CenterTrigger({ value }: { value?: CenterOption }) {
  const { isOpen } = useDropdownContext();
  return (
    <button
      type="button"
      className="md:text-base-medium flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm text-slate-600 hover:text-slate-900"
    >
      {value?.label}
      {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
    </button>
  );
}

export default function CenterFilter({ options, value, onChange }: CenterFilterProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <CenterTrigger value={value} />
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item key={option.value} onClick={() => onChange(option)}>
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
