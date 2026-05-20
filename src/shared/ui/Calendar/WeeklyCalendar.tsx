"use client";

import { addDays, format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import DayItem from "./DayItem";
import { useCalendar } from "./useCalendar";

// 임시데이터
const MOCK_WORKOUT_DATA = {
  completedDays: new Set(["2026-05-18", "2026-05-19", "2026-05-15", "2026-05-25"]),
  reservedDays: new Set(["2026-05-21", "2026-05-23", "2026-05-28"]),
};
// 재렌더링 방지 전역 상수
const FIXED_TODAY = new Date();

export default function WeeklyCalendar() {
  const swiperRef = useRef<SwiperType | null>(null);

  const {
    currentStart: currentWeekStart, // Week별칭
    selectedDate,
    setSelectedDate,
    canMovePrev,
    canMoveNext,
    move: moveWeek,
  } = useCalendar(FIXED_TODAY, "week");

  // 이전 주
  const prevWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(currentWeekStart, index - 7);

      return {
        date, // Sun May 10 2026 00:00:00
        dateKey: format(date, "yyyy-MM-dd"), // "2026-05-10"
        weekday: format(date, "eee", { locale: ko }), // "일"
        dayNumber: format(date, "d"), // "10"
      };
    });
  }, [currentWeekStart]);

  // 이번 주
  const currentWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(currentWeekStart, index);

      return {
        date,
        dateKey: format(date, "yyyy-MM-dd"),
        weekday: format(date, "eee", { locale: ko }),
        dayNumber: format(date, "d"),
      };
    });
  }, [currentWeekStart]);

  // 다음 주
  const nextWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(currentWeekStart, index + 7);

      return {
        date,
        dateKey: format(date, "yyyy-MM-dd"),
        weekday: format(date, "eee", { locale: ko }),
        dayNumber: format(date, "d"),
      };
    });
  }, [currentWeekStart]);

  const weeks = [prevWeek, currentWeek, nextWeek];

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {format(FIXED_TODAY, "M월 d일 eeee", {
            locale: ko,
          })}
        </h2>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* 캘린더 */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-linear-to-l from-white to-transparent" />
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          initialSlide={1}
          slidesPerView={1.2}
          centeredSlides={true}
          resistance
          //resistanceRatio={0.45}
          speed={450}
          onTransitionEnd={(swiper) => {
            const currentIndex = swiper.activeIndex;

            if (currentIndex === 0) {
              if (canMovePrev) {
                moveWeek("prev"); // 1. 데이터를 지난주로 체인지
                swiper.slideTo(1, 0, false); // 2. 애니메이션 없이 즉시 중앙 슬라이드로 워프!
              } else {
                swiper.slideTo(1); // 범위를 벗어나면 제자리 백
              }
            }
            if (currentIndex === 2) {
              if (canMoveNext) {
                moveWeek("next"); // 1. 데이터를 다음주로 체인지
                swiper.slideTo(1, 0, false); // 2. 애니메이션 없이 즉시 중앙 슬라이드로 워프!
              } else {
                swiper.slideTo(1); // 범위를 벗어나면 제자리 백
              }
            }
          }}
        >
          {weeks.map((week, weekIndex) => {
            return (
              <SwiperSlide key={weekIndex}>
                <div className="grid w-full grid-cols-7 pb-2">
                  {week.map((day) => {
                    const isDone = MOCK_WORKOUT_DATA.completedDays.has(day.dateKey);

                    const isReserved = MOCK_WORKOUT_DATA.reservedDays.has(day.dateKey);

                    const isSelected = isSameDay(day.date, selectedDate);

                    return (
                      <DayItem
                        key={day.dateKey}
                        day={day}
                        isDone={isDone}
                        isReserved={isReserved}
                        isSelected={isSelected}
                        onSelect={setSelectedDate}
                      />
                    );
                  })}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
