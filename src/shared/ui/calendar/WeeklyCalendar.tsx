"use client";

import { format, isSameDay } from "@/shared/lib/date";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import DayItem from "./DayItem";
import { useCalendar } from "./useCalendar";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const MOCK_WORKOUT_DATA = {
  completedDays: new Set([
    "2026-06-02",
    "2026-06-04",
    "2026-06-06",
    "2026-06-09",
  ]),
  reservedDays: new Set([
    "2026-06-04",
    "2026-06-06",
    "2026-06-09",
    "2026-06-11",
    "2026-06-15",
    "2026-06-17",
    "2026-06-23",
    "2026-06-25",
  ]),
};

export default function WeeklyCalendar() {
  const pickerType = "week";
  const swiperRef = useRef<SwiperType | null>(null);
  const [today] = useState(() => new Date());

  const {
    calendarSlides,
    currentStart,
    activeIndex,
    setActiveIndex,
    selectedDate,
    setSelectedDate,
    canMovePrev,
    canMoveNext,
  } = useCalendar(today, pickerType);

  return (
    <>
      {/* 헤더 */}
      <div className="absolute top-0 left-0 flex items-center justify-between px-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentStart, "M월")} 다짐 기록
        </h2>
        {/* <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canMovePrev}
            onClick={() => {
              //   moveWeek("prev");

              swiperRef.current?.slidePrev();
            }}
            className={`rounded-full p-2 transition-colors ${
              canMovePrev
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-not-allowed text-gray-300 opacity-30"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            disabled={!canMoveNext}
            onClick={() => {
              //   moveWeek("next");

              swiperRef.current?.slideNext();
            }}
            className={`rounded-full p-2 transition-colors ${
              canMoveNext
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-not-allowed text-gray-300 opacity-30"
            }`}
          >
            <ChevronRight size={20} />
          </button>
      </div> */}
      </div>
      <div className="mx-auto w-full max-w-3xl bg-white py-5">
        {/* 요일 라벨 (Swiper 밖에서 고정) */}
        <div className="mb-3 grid grid-cols-7 border-b border-b-2 border-gray-100 pb-1 text-center">
          {WEEKDAYS.map((day) => (
            <span key={day} className="text-[12px] font-medium text-gray-400">
              {day}
            </span>
          ))}
        </div>

        {/* 날짜 그리드 (스와이프 전용) */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          initialSlide={activeIndex}
          slidesPerView={1}
          onSlideChangeTransitionEnd={(s) => setActiveIndex(s.activeIndex)}
          className="w-full"
        >
          {calendarSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid grid-cols-7 justify-items-center">
                {slide.days.map((date) => {
                  const dateKey = format(date, "yyyy-MM-dd");
                  const isDone = MOCK_WORKOUT_DATA.completedDays.has(dateKey);
                  const isReserved =
                    MOCK_WORKOUT_DATA.reservedDays.has(dateKey);

                  return (
                    <div key={dateKey} className="w-full">
                      <DayItem
                        day={{
                          date,
                          dateKey,
                          dayNumber: format(date, "d"),
                        }}
                        isSelected={isSameDay(date, selectedDate)}
                        onSelect={setSelectedDate}
                        isDone={isDone}
                        isReserved={isReserved}
                        pickerType={pickerType}
                      />
                    </div>
                  );
                })}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
