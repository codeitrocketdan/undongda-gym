"use client";

import Dropdown from "@/shared/ui/dropdown/Dropdown";
import { ListFilter } from "lucide-react";

export interface SortOption {
  label: string;
  value: string;
}

interface SortFilterProps {
  options: SortOption[];
  value?: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortFilter({ options, value, onChange }: SortFilterProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          type="button"
          className="md:text-base-medium text-sm-medium flex cursor-pointer items-center gap-1 text-slate-600 hover:text-slate-900"
        >
          <ListFilter size={16} />
          <span>{value?.label}</span>
        </button>
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
