"use client";

import { ko } from "@/shared/lib/date";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

interface CalendarPanelProps {
  value?: Date;
  onSelect: (date: Date | undefined) => void;
  onReset: () => void;
  onApply: () => void;
  disablePast?: boolean;
  applyDisabled?: boolean;
}

export default function CalendarPanel({
  value,
  onSelect,
  onReset,
  onApply,
  disablePast,
  applyDisabled,
}: CalendarPanelProps) {
  return (
    <>
      <DayPicker
        mode="single"
        selected={value}
        onSelect={onSelect}
        locale={ko}
        disabled={disablePast ? { before: new Date() } : undefined}
        classNames={{
          selected: "bg-blue-500 text-white rounded-full hover:bg-blue-600",
          today: "text-blue-500 font-bold",
          chevron: "fill-gray-800",
        }}
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 cursor-pointer rounded-xl border border-blue-500 py-2 font-medium text-blue-500 hover:bg-blue-50"
        >
          초기화
        </button>
        <button
          type="button"
          disabled={applyDisabled}
          onClick={onApply}
          className="flex-1 cursor-pointer rounded-xl bg-blue-500 py-2 font-medium text-white hover:bg-blue-600"
        >
          적용
        </button>
      </div>
    </>
  );
}
