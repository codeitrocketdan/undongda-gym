"use client";

import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";

const MAX_RANGE = 2; // 오늘 기준 앞뒤로 2개씩

type CalendarType = "week" | "month";

export function useCalendar(TODAY: Date, type: CalendarType = "week") {
  // 1. 기준이 되는 오늘 달/주의 시작점 (고정)
  const initialStart = useMemo(() => {
    return type === "week" ? startOfWeek(TODAY, { weekStartsOn: 0 }) : startOfMonth(TODAY);
  }, [TODAY, type]);

  // 2. 처음부터 슬라이드 날짜들을 배열로 미리 생성
  const calendarSlides = useMemo(() => {
    const slides = [];
    for (let i = -MAX_RANGE; i <= MAX_RANGE; i++) {
      const baseDate = type === "week" ? addWeeks(initialStart, i) : addMonths(initialStart, i);

      // 각 슬라이드에 들어갈 일자 그리드 계산
      const startDate =
        type === "week" ? startOfWeek(baseDate, { weekStartsOn: 0 }) : startOfMonth(baseDate);
      const endDate =
        type === "week" ? endOfWeek(baseDate, { weekStartsOn: 0 }) : endOfMonth(baseDate);

      // 월간일 경우 앞뒤 주간 패딩을 위한 처리
      const gridStart = type === "week" ? startDate : startOfWeek(startDate, { weekStartsOn: 0 });
      const gridEnd = type === "week" ? endDate : endOfWeek(endDate, { weekStartsOn: 0 });

      // 일자 채우기
      const days = [];
      const current = new Date(gridStart);
      while (current <= gridEnd) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      slides.push({
        id: format(baseDate, type === "week" ? "yyyy-II" : "yyyy-MM"), // 고유 ID
        baseDate, // 헤더 타이틀용 날짜
        days, // 해당 달/주의 날짜 배열
      });
    }
    return slides;
  }, [initialStart, type]);

  // 3. 초기 Swiper가 바라보고 있는 방의 인덱스 (초기값은 가운데인 MAX_RANGE 슬라이드)
  const [activeIndex, setActiveIndex] = useState(MAX_RANGE);
  const [selectedDate, setSelectedDate] = useState(() => TODAY);

  // 4. 현재 인덱스 기준으로 상태 및 버튼 활성화 여부 계산
  const currentStart = calendarSlides[activeIndex].baseDate;
  const canMovePrev = activeIndex > 0;
  const canMoveNext = activeIndex < calendarSlides.length - 1;

  return {
    calendarSlides,
    currentStart,
    activeIndex,
    setActiveIndex,
    selectedDate,
    setSelectedDate,
    canMovePrev,
    canMoveNext,
  };
}
