"use client";

import { addMonths, format, isSameDay, isSameMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import DayItem from "./DayItem";
import { useCalendar } from "./useCalendar"; // 통합 만능 훅

const FIXED_TODAY = new Date();
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// ⭕ 주간 달력과 동일한 목데이터 연동
const MOCK_WORKOUT_DATA = {
  completedDays: new Set(["2026-04-29", "2026-05-18", "2026-05-19", "2026-05-15", "2026-05-25"]),
  reservedDays: new Set(["2026-05-21", "2026-05-23", "2026-05-28"]),
};

export default function MonthlyCalendar() {
  const swiperRef = useRef<SwiperType | null>(null);

  // 통합 훅 사용 (mode: "month")
  const {
    currentStart: currentMonthStart,
    selectedDate,
    setSelectedDate,
    canMovePrev,
    canMoveNext,
    move: moveMonth,
    getDaysInMonthGrid,
  } = useCalendar(FIXED_TODAY, "month");

  // 이전/현재/다음 달의 6주치 그리드 데이터 연산
  const monthSlides = useMemo(() => {
    return [
      getDaysInMonthGrid(subMonths(currentMonthStart, 1)),
      getDaysInMonthGrid(currentMonthStart),
      getDaysInMonthGrid(addMonths(currentMonthStart, 1)),
    ];
  }, [currentMonthStart, getDaysInMonthGrid]);

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
      {/* 헤더: 연도 및 월 표시 */}
      <div className="mb-6 flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentMonthStart, "yyyy년 M월")}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              moveMonth("prev");
              swiperRef.current?.slidePrev();
            }}
            disabled={!canMovePrev}
            className={`rounded-full p-2 transition-colors ${
              canMovePrev
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-not-allowed text-gray-200 opacity-30"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => {
              moveMonth("next");
              swiperRef.current?.slideNext();
            }}
            disabled={!canMoveNext}
            className={`rounded-full p-2 transition-colors ${
              canMoveNext
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-not-allowed text-gray-200 opacity-30"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 요일 라벨 (고정) */}
      <div className="mb-4 grid grid-cols-7 border-b border-gray-50 pb-2 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[12px] font-medium text-gray-400">
            {day}
          </span>
        ))}
      </div>

      {/* 월간 그리드 Swiper (양옆 그라데이션 적용) */}
      <div className="relative w-full">
        {/* ── 👈 왼쪽 그라데이션 마스크 ── */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent" />

        {/* ── 👉 오른쪽 그라데이션 마스크 ── */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-6 bg-gradient-to-l from-white to-transparent" />

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          initialSlide={1}
          slidesPerView={1.15} // ✨ 양옆이 살짝 보이도록 설정 (1.2가 너무 넓으면 1.15~1.2 사이 조절)
          centeredSlides={true} // ✨ 현재 월 중심 정렬
          spaceBetween={12} // 슬라이드 간격
          speed={450}
          resistance
          //   onTransitionEnd={(swiper) => {
          //     if (swiper.activeIndex === 0 && canMovePrev) {
          //       moveMonth("prev");
          //       swiper.slideTo(1, 0); // 애니메이션 없이 복귀
          //     }
          //     if (swiper.activeIndex === 2 && canMoveNext) {
          //       moveMonth("next");
          //       swiper.slideTo(1, 0); // 애니메이션 없이 복귀
          //     }
          //   }}
        >
          {monthSlides.map((days, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              {/* 월간은 날짜가 많으므로 행간 간격(gap-y-3)을 줍니다 */}
              <div className="grid grid-cols-7 justify-items-center gap-y-3">
                {days.map((date) => {
                  const dateKey = format(date, "yyyy-MM-dd");
                  const isCurrentMonth = isSameMonth(date, currentMonthStart);

                  // ⭕ 목데이터 조건 판별
                  const isDone = MOCK_WORKOUT_DATA.completedDays.has(dateKey);
                  const isReserved = MOCK_WORKOUT_DATA.reservedDays.has(dateKey);

                  return (
                    <div
                      key={dateKey}
                      className={`w-full transition-opacity ${isCurrentMonth ? "opacity-100" : "opacity-25"}`}
                    >
                      <DayItem
                        day={{
                          date,
                          dateKey,
                          weekday: "", // 월간 뷰에서는 요일 안 보이게 빈값 처리
                          dayNumber: format(date, "d"),
                        }}
                        isSelected={isSameDay(date, selectedDate)}
                        isDone={isDone} // ⭕ 연동 완료
                        isReserved={isReserved} // ⭕ 연동 완료
                        onSelect={setSelectedDate}
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
  );
}
