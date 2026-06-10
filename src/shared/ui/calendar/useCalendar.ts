"use client";

import {
  addMonths,
  addWeeks,
  differenceInCalendarWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "@/shared/lib/date";
import { useMemo, useState } from "react";

const MAX_RANGE = 2; // 오늘 기준 앞뒤로 2개씩

type CalendarType = "week" | "month";

export function useCalendar(TODAY: Date, type: CalendarType = "week") {
  // 기준이 되는 오늘 달/주의 시작점 (고정)
  const initialStart = useMemo(() => {
    return type === "week"
      ? startOfWeek(TODAY, { weekStartsOn: 0 })
      : startOfMonth(TODAY);
  }, [TODAY, type]);

  // 주간일 때 현재 월의 첫 주와 마지막 주 범위 동적 계산
  const { prevRange, nextRange, initialActiveIndex } = useMemo(() => {
    if (type === "month") {
      return {
        prevRange: MAX_RANGE,
        nextRange: MAX_RANGE,
        initialActiveIndex: MAX_RANGE,
      };
    }

    // 주간(week)일 때: 이번 달의 첫 날과 마지막 날 계산
    const monthStart = startOfMonth(TODAY);
    const monthEnd = endOfMonth(TODAY);

    // 오늘 속한 주와 첫 주, 마지막 주의 차이 계산 (date-fns 함수 활용)
    const prevRange = Math.abs(
      differenceInCalendarWeeks(initialStart, monthStart, { weekStartsOn: 0 })
    );
    const nextRange = Math.abs(
      differenceInCalendarWeeks(monthEnd, initialStart, { weekStartsOn: 0 })
    );

    return {
      prevRange,
      nextRange,
      initialActiveIndex: prevRange, // 0부터 시작하므로 앞으로 갈 수 있는 방의 개수가 곧 오늘 주차의 index가 됩니다.
    };
  }, [TODAY, initialStart, type]);

  // 처음부터 슬라이드 날짜들을 배열로 미리 생성
  const calendarSlides = useMemo(() => {
    const slides = [];
    for (let i = -prevRange; i <= nextRange; i++) {
      const baseDate =
        type === "week"
          ? addWeeks(initialStart, i)
          : addMonths(initialStart, i);

      // 각 슬라이드에 들어갈 일자 그리드 계산
      const startDate =
        type === "week"
          ? startOfWeek(baseDate, { weekStartsOn: 0 })
          : startOfMonth(baseDate);
      const endDate =
        type === "week"
          ? endOfWeek(baseDate, { weekStartsOn: 0 })
          : endOfMonth(baseDate);

      // 월간일 경우 앞뒤 주간 패딩을 위한 처리
      const gridStart =
        type === "week"
          ? startDate
          : startOfWeek(startDate, { weekStartsOn: 0 });
      const gridEnd =
        type === "week" ? endDate : endOfWeek(endDate, { weekStartsOn: 0 });

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
  }, [initialStart, type, prevRange, nextRange]);

  // 초기 Swiper가 바라보고 있는 방의 인덱스 (초기값은 가운데인 MAX_RANGE 슬라이드)
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [selectedDate, setSelectedDate] = useState(() => TODAY);

  // 현재 인덱스 기준으로 상태 및 버튼 활성화 여부 계산
  const currentStart = calendarSlides[activeIndex]?.baseDate || initialStart;
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
