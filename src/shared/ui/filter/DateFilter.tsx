"use client";

import CalendarPanel from "@/shared/ui/datePicker/CalendarPanel";
import { useDatePicker } from "@/shared/ui/datePicker/usePicker";
import { formatDate } from "@/shared/ui/datePicker/utils";
import Dropdown, { useDropdownContext } from "@/shared/ui/dropdown/Dropdown";
import FilterTrigger from "./FilterTrigger";

interface DateFilterProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

function DatePickerMenu({ value, onChange }: DateFilterProps) {
  const { isOpen, close } = useDropdownContext();
  const { tempValue, setTempValue, handleReset } = useDatePicker<Date>({
    initialValue: value,
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onChange(tempValue);
    close();
  };

  return (
    <div className="absolute left-0 z-50 mt-1 rounded-xl border border-slate-200 bg-white p-3 shadow-lg md:right-0 md:left-auto">
      <CalendarPanel
        value={tempValue}
        onSelect={setTempValue}
        onReset={handleReset}
        onApply={handleApply}
      />
    </div>
  );
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <FilterTrigger label={value ? formatDate(value) : "날짜 전체"} />
      </Dropdown.Trigger>
      <DatePickerMenu value={value} onChange={onChange} />
    </Dropdown>
  );
}
