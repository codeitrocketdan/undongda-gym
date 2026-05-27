"use client";

import { format, isSameDay } from "date-fns";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Bell, CalendarCheck } from "lucide-react";
import DayItem from "./DayItem";
import { useCalendar } from "./useCalendar";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const MOCK_WORKOUT_DATA = {
  completedDays: new Set(["2026-04-29", "2026-05-18", "2026-05-19", "2026-05-15", "2026-05-25"]),
  reservedDays: new Set(["2026-05-21", "2026-05-23", "2026-05-25", "2026-05-28"]),
};

export default function WeeklyCalendar() {
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
  } = useCalendar(today, "week");

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white py-5">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between px-6">
        <h2 className="text-xl font-bold text-gray-900">
          {/* {format(currentStart, "yyyy년 M월 eeee", { locale: ko })} */}
        </h2>
        <div className="flex items-center gap-3">
          <Bell size={28} />
          <CalendarCheck size={28} />
        </div>
      </div>

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
            <div className="grid grid-cols-7 justify-items-center pb-4">
              {slide.days.map((date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                const isDone = MOCK_WORKOUT_DATA.completedDays.has(dateKey);
                const isReserved = MOCK_WORKOUT_DATA.reservedDays.has(dateKey);

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
                    />
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
