"use client";

import Dropdown from "@/shared/ui/dropdown/Dropdown";
import FilterTrigger from "./FilterTrigger";

export interface CenterOption {
  label: string;
  value: string;
}

interface CenterFilterProps {
  options: CenterOption[];
  value?: CenterOption;
  onChange: (value: CenterOption) => void;
}

export default function CenterFilter({
  options,
  value,
  onChange,
}: CenterFilterProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <FilterTrigger label={value?.label} />
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
