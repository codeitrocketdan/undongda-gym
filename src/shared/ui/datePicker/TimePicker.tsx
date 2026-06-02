"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Clock4 } from "lucide-react";
import { TimePickerProps } from "./types";
import { useDatePicker } from "./usePicker";
import { useTimePicker } from "./useTimePicker";
import { HOURS, MINUTES, formatTime, isPastHour, isPastMinute } from "./utils";

export default function TimePicker({
  value,
  onChange,
  selectedDate,
  label,
}: TimePickerProps) {
  const [innerValue, setInnerValue] = useState("");
  const currentValue = value ?? innerValue;

  const { isOpen, ref, triggerRef, coords, openModal, closeModal } =
    useDatePicker<string>({
      initialValue: currentValue,
    });
  const {
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    applyTime,
    resetTime,
    formattedTime,
  } = useTimePicker();

  // UX 개선 : 스크롤 위치 고정
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // '적용'버튼 클릭 시 값 넣고 모달 닫기
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

    if (!currentValue) {
      resetTime();
      return;
    }
    const [hour, minute] = currentValue.split(":").map(Number);
    applyTime(hour, minute);
  }, [isOpen, currentValue, resetTime, applyTime]);

  // 기존에 선택한 시간/분 위치로 스크롤(모션x)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      if (selectedHour !== null && hourScrollRef.current) {
        const target = hourScrollRef.current.querySelector(
          `[data-hour="${selectedHour}"]`
        ) as HTMLElement;
        if (target)
          target.scrollIntoView({ block: "center", behavior: "instant" });
      }
      if (selectedMinute !== null && minuteScrollRef.current) {
        const target = minuteScrollRef.current.querySelector(
          `[data-minute="${selectedMinute}"]`
        ) as HTMLElement;
        if (target)
          target.scrollIntoView({ block: "center", behavior: "instant" });
      }
    };

    // 브라우저에게 "다음 프레임 그리기 전에 이 스크롤부터 옮겨줘"라고 요청
    const frameId = requestAnimationFrame(handleScroll);

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, selectedHour, selectedMinute]);

  return (
    <div className="relative w-48">
      {/* 시간 입력 인풋 */}
      {label && (
        <span className="mb-1 block text-sm font-semibold text-teal-700">
          {label}
        </span>
      )}
      <div
        ref={triggerRef}
        onClick={openModal}
        tabIndex={0}
        className="flex cursor-pointer items-center rounded-xl border border-teal-400 bg-white p-3 transition hover:border-teal-600"
      >
        <span className="mr-2">
          <Clock4 />
        </span>
        <span
          className={`font-medium ${currentValue ? "text-gray-700" : "text-gray-400"} `}
        >
          {currentValue || "00 : 00"}
        </span>
      </div>

      {/* 시간 선택 팝오버 */}
      {isOpen &&
        createPortal(
          <div
            ref={ref}
            className="absolute z-50 w-44 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              opacity: coords.top === 0 ? 0 : 1,
            }}
          >
            <div className="flex h-48 divide-x divide-gray-200">
              {/* '시' 스크롤 영역 */}
              <div
                ref={hourScrollRef}
                className="flex-1 scrollbar-none overflow-y-auto pr-1"
              >
                <div className="flex flex-col gap-1 pb-1">
                  {HOURS.map((hour) => {
                    const disabled = isPastHour(selectedDate, hour);

                    return (
                      <button
                        key={hour}
                        disabled={disabled}
                        onClick={() => setSelectedHour(hour)}
                        data-hour={hour}
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
              <div
                ref={minuteScrollRef}
                className="flex-1 scrollbar-none overflow-y-auto pl-2"
              >
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
                        data-minute={minute}
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
          </div>,
          document.body
        )}
    </div>
  );
}
