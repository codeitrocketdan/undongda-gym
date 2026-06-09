"use client";
import { ko } from "@/shared/lib/date";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

import { Calendar } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { DatePickerProps } from "./types";
import { useDatePicker } from "./usePicker";
import { formatDate } from "./utils";

export default function DatePicker({
  value,
  onChange,
  label,
}: DatePickerProps) {
  // 컴포넌트 단독 사용 시 부모에서 관리x 내부값으로 설정
  const [innerValue, setInnerValue] = useState<Date>();
  const currentValue = value ?? innerValue;

  const {
    isOpen,
    ref,
    triggerRef,
    coords,
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
      setInnerValue(tempValue); // 부모에게 전달되는 값 innerValue
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
        ref={triggerRef}
        tabIndex={0}
        role="button"
        onClick={openModal}
        className="flex cursor-pointer items-center rounded-xl border border-blue-500 bg-white p-3 transition hover:border-blue-600"
      >
        <span className="mr-2">
          <Calendar />
        </span>
        <input
          type="text"
          readOnly
          tabIndex={-1}
          placeholder="YYYY-MM-DD"
          value={formatDate(currentValue)}
          className="w-full cursor-pointer text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>

      {/* 달력 모달 */}
      {isOpen &&
        createPortal(
          <div
            ref={ref}
            className="absolute z-[9999] w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              opacity: coords.top === 0 ? 0 : 1,
            }}
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
                selected:
                  "bg-blue-500 text-white rounded-full hover:bg-blue-600",
                today: "text-blue-500 font-bold",
                chevron: "fill-gray-800",
              }}
            />

            {/* 하단 버튼 */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 cursor-pointer rounded-xl border border-blue-500 py-2 font-medium text-blue-500 hover:bg-blue-50"
              >
                초기화
              </button>
              <button
                disabled={!tempValue}
                onClick={handleApply}
                className="flex-1 cursor-pointer rounded-xl bg-blue-500 py-2 font-medium text-white hover:bg-blue-600"
              >
                적용
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
