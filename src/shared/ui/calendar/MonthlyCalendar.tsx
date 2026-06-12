"use client";

import { format, isSameMonth } from "@/shared/lib/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import DagymDetailPanel from "./DagymDetailPanel";
import DayItem from "./DayItem";
import type { CalendarDagym } from "./types";
import { useCalendar } from "./useCalendar";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface MonthlyCalendarProps {
  meetings?: CalendarDagym[];
}

export default function MonthlyCalendar({
  meetings = [],
}: MonthlyCalendarProps) {
  const pickerType = "month";
  const swiperRef = useRef<SwiperType | null>(null);
  const [today] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const {
    calendarSlides,
    currentStart: currentMonthStart,
    activeIndex,
    setActiveIndex,
    canMovePrev,
    canMoveNext,
  } = useCalendar(today, pickerType);

  const completedDays = useMemo(
    () =>
      new Set(
        meetings
          .filter((m) => m.isCompleted)
          .map((m) => format(new Date(m.dateTime)))
      ),
    [meetings]
  );

  const reservedDays = useMemo(
    () => new Set(meetings.map((m) => format(new Date(m.dateTime)))),
    [meetings]
  );

  const selectedMeetings = useMemo(
    () =>
      selectedDateKey
        ? meetings.filter(
            (m) => format(new Date(m.dateTime)) === selectedDateKey
          )
        : [],
    [selectedDateKey, meetings]
  );

  const handleDaySelect = (date: Date) => {
    const key = format(date);
    if (completedDays.has(key) || reservedDays.has(key)) {
      setSelectedDateKey(key);
    }
  };

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white">
      {/* 두 패널을 가로로 나란히 배치, translate로 전환 */}
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          width: "200%",
          transform: selectedDateKey ? "translateX(-50%)" : "translateX(0)",
        }}
      >
        {/* 캘린더 패널 */}
        <div
          className={`w-1/2 ${selectedDateKey ? "pointer-events-none" : ""}`}
        >
          <div className="mb-6 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-900">
              {format(currentMonthStart, "yyyy년 M월")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="이전 달로 이동"
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={!canMovePrev}
                className={`cursor-pointer rounded-full p-2 transition-colors ${
                  canMovePrev
                    ? "text-gray-600 hover:bg-gray-100"
                    : "cursor-not-allowed text-gray-200 opacity-30"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="다음 달로 이동"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!canMoveNext}
                className={`cursor-pointer rounded-full p-2 transition-colors ${
                  canMoveNext
                    ? "text-gray-600 hover:bg-gray-100"
                    : "cursor-not-allowed text-gray-200 opacity-30"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-7 border-b border-gray-50 pb-2 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-[12px] font-medium text-gray-400">
                {day}
              </span>
            ))}
          </div>

          <div className="relative w-full">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              initialSlide={activeIndex}
              slidesPerView={1}
              centeredSlides={true}
              spaceBetween={12}
              speed={400}
              onSlideChangeTransitionEnd={(s) => setActiveIndex(s.activeIndex)}
            >
              {calendarSlides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="grid grid-cols-7 justify-items-center gap-y-3">
                    {slide.days.map((date) => {
                      const dateKey = format(date, "yyyy-MM-dd");
                      const isCurrentMonth = isSameMonth(date, slide.baseDate);
                      const isDone = completedDays.has(dateKey);
                      const isReserved = reservedDays.has(dateKey);

                      return (
                        <div
                          key={dateKey}
                          className={`w-full ${isCurrentMonth ? "opacity-100" : "opacity-25"}`}
                        >
                          <DayItem
                            day={{
                              date,
                              dateKey,
                              dayNumber: format(date, "d"),
                            }}
                            isSelected={selectedDateKey === dateKey}
                            isDone={isDone}
                            isReserved={isReserved}
                            onSelect={handleDaySelect}
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
        </div>

        {/* 상세 패널 */}
        <DagymDetailPanel
          selectedDateKey={selectedDateKey}
          meetings={selectedMeetings}
          onBack={() => setSelectedDateKey(null)}
          isActive={!!selectedDateKey}
        />
      </div>
    </div>
  );
}
