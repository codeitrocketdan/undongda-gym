"use client";

import { useEffect, useState } from "react";

import { TimePickerProps } from "./types";
import { useDatePicker } from "./usePicker";
import { useTimePicker } from "./useTimePicker";
import { formatTime, isPastHour, isPastMinute } from "./utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export default function TimePicker({
  value,
  onChange,
  selectedDate,
}: TimePickerProps) {
  const [innerValue, setInnerValue] = useState("");
  const currentValue = value ?? innerValue;

  const { isOpen, ref, openModal, closeModal } = useDatePicker<string>({
    initialValue: currentValue,
  });
  const {
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    formattedTime,
  } = useTimePicker({
    initialValue: currentValue,
  });

  const handleApply = () => {
    if (selectedHour === null || selectedMinute === null) return;

    const time = formatTime(selectedHour, selectedMinute);

    if (onChange) {
      onChange(time);
    } else {
      setInnerValue(time);
    }

    closeModal();
  };

  // 모달 열릴 때 기존 값 세팅
  useEffect(() => {
    if (!isOpen) return;

    if (!currentValue) return;

    const [hour, minute] = currentValue.split(":");

    setSelectedHour(Number(hour));
    setSelectedMinute(Number(minute));
  }, [isOpen, currentValue, setSelectedHour, setSelectedMinute]);

  return (
    <div className="relative w-48">
      {/* 시간 입력 인풋 (클릭 시 팝오버 토글) */}
      <div
        onClick={openModal}
        className="flex cursor-pointer items-center rounded-xl border border-teal-400 bg-white p-3 transition hover:border-teal-600"
      >
        <span className="mr-2 text-gray-500">🕒</span>
        <span
          className={`font-medium ${currentValue ? "text-gray-700" : "text-gray-400"} `}
        >
          {currentValue || "00 : 00"}
        </span>
      </div>

      {/* 시간 선택 팝오버 */}
      {isOpen && (
        <div
          ref={ref}
          className="absolute z-50 mt-2 w-44 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
        >
          {/* 두 개의 열 (시 | 분) */}
          <div className="flex h-48 divide-x divide-gray-200">
            {/* '시' 스크롤 영역 */}
            <div className="flex-1 scrollbar-thin overflow-y-auto pr-1">
              <div className="flex flex-col gap-1 pb-1">
                {HOURS.map((hour) => {
                  const disabled = isPastHour(selectedDate, hour);

                  return (
                    <button
                      key={hour}
                      disabled={disabled}
                      //   onClick={() => setSelectedTime((prev) => ({ ...prev, hour: h }))}
                      onClick={() => setSelectedHour(hour)}
                      className={`rounded-lg py-1.5 text-center text-sm font-semibold transition ${
                        selectedHour === hour
                          ? "bg-teal-50 font-bold text-teal-700"
                          : "text-gray-700 hover:bg-gray-50"
                      } disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent`}
                    >
                      {String(hour).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* '분' 스크롤 영역 */}
            <div className="flex-1 scrollbar-thin overflow-y-auto pl-2">
              <div className="flex flex-col gap-1 pb-1">
                {MINUTES.map((minute) => {
                  const disabled =
                    selectedHour !== null
                      ? isPastMinute(selectedDate, selectedHour, minute)
                      : false;

                  return (
                    <button
                      key={minute}
                      disabled={disabled}
                      onClick={() => setSelectedMinute(minute)}
                      className={`rounded-lg py-1.5 text-center text-sm font-semibold transition ${
                        selectedMinute === minute
                          ? "bg-teal-50 font-bold text-teal-700"
                          : "text-gray-700 hover:bg-gray-50"
                      } disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent`}
                    >
                      {String(minute).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 확인 버튼 (선택 완료 시 닫기) */}
          <button
            disabled={!formattedTime}
            onClick={handleApply}
            className="mt-3 w-full rounded-xl bg-teal-500 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
