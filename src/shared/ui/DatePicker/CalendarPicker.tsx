"use client";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { ko } from "date-fns/locale";

import { useState } from "react";
import { CalendarPickerProps } from "./types";
import { useDatePicker } from "./usePicker";
import { formatDate } from "./utils";

export default function CalendarPicker({
  value,
  onChange,
  label,
}: CalendarPickerProps) {
  // 컴포넌트 단독 사용 시 부모에서 관리x 내부값으로 설정
  const [innerValue, setInnerValue] = useState<Date>();
  const currentValue = value ?? innerValue;

  const {
    isOpen,
    ref,
    tempValue,
    setTempValue,
    openModal,
    closeModal,
    handleReset,
  } = useDatePicker<Date>({
    initialValue: currentValue,
  });

  // 선택한 날짜 적용
  const handleApply = () => {
    if (onChange) {
      onChange(tempValue);
    } else {
      setInnerValue(tempValue);
    }
    closeModal();
  };

  return (
    <div className="relative w-64">
      {label && (
        <label className="mb-1 block text-sm font-semibold text-teal-700">
          {label}
        </label>
      )}

      {/* 날짜 입력 인풋 */}
      <div
        onClick={openModal}
        className="flex cursor-pointer items-center rounded-xl border border-teal-400 bg-white p-3 transition hover:border-teal-600"
      >
        <span className="mr-2">📅</span>
        <input
          type="text"
          readOnly
          placeholder="YYYY-MM-DD"
          value={formatDate(currentValue)}
          className="w-full cursor-pointer text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>

      {/* 달력 모달 */}
      {isOpen && (
        <div
          ref={ref}
          className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <DayPicker
            mode="single"
            selected={tempValue}
            onSelect={setTempValue}
            locale={ko} // 한국어 설정
            disabled={{
              before: new Date(),
            }}
            // react-day-picker 내부 기능 특정 상태 class 지정
            classNames={{
              selected: "bg-teal-500 text-white rounded-full hover:bg-teal-600",
              today: "text-teal-500 font-bold",
            }}
          />

          {/* 하단 버튼 */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 rounded-xl border border-teal-500 py-2 font-medium text-teal-500 hover:bg-teal-50"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-xl bg-teal-500 py-2 font-medium text-white hover:bg-teal-600"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
