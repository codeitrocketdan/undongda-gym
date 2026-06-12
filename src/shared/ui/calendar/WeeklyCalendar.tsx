"use client";

import { format } from "@/shared/lib/date";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import DayItem from "./DayItem";
import { useCalendar } from "./useCalendar";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface WeeklyCalendarProps {
  completedDays?: Set<string>;
  reservedDays?: Set<string>;
  onDateClick?: (dateKey: string) => void;
}

export default function WeeklyCalendar({
  completedDays = new Set(),
  reservedDays = new Set(),
  onDateClick,
}: WeeklyCalendarProps) {
  const pickerType = "week";
  const swiperRef = useRef<SwiperType | null>(null);
  const [today] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const { calendarSlides, currentStart, activeIndex, setActiveIndex } =
    useCalendar(today, pickerType);

  const handleDaySelect = (date: Date) => {
    const key = format(date);
    if (completedDays.has(key) || reservedDays.has(key)) {
      setSelectedDateKey(key);
      onDateClick?.(key);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 flex items-center justify-between px-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(today, "M월")} 다짐 기록
        </h2>
      </div>
      <div className="mx-auto w-full max-w-3xl bg-white py-5">
        <div className="mb-3 grid grid-cols-7 border-b border-b-2 border-gray-100 pb-1 text-center">
          {WEEKDAYS.map((day) => (
            <span key={day} className="text-[12px] font-medium text-gray-400">
              {day}
            </span>
          ))}
        </div>
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
                  const isDone = completedDays.has(dateKey);
                  const isReserved = reservedDays.has(dateKey);

                  return (
                    <div key={dateKey} className="w-full">
                      <DayItem
                        day={{ date, dateKey, dayNumber: format(date, "d") }}
                        isSelected={selectedDateKey === dateKey}
                        onSelect={handleDaySelect}
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
