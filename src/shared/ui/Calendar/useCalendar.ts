"use client";

import {
  addMonths,
  addWeeks,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { useState } from "react";

const MAX_RANGE = 2; // 이동 가능한 범위 지정

// 주간과 월간 모드 구분 타입
type CalendarType = "week" | "month";

export function useCalendar(TODAY: Date, type: CalendarType = "week") {
  // 오늘 기준 시작 일 (변경x)
  const [initialStart] = useState(() =>
    type === "week" ? startOfWeek(TODAY, { weekStartsOn: 0 }) : startOfMonth(TODAY)
  );

  // 화면에 보이는 기준 시작 일 (변경o)
  const [currentStart, setCurrentStart] = useState(initialStart);
  const [selectedDate, setSelectedDate] = useState(() => TODAY);

  //오늘(initialStart)을 기준으로 현재 보고 있는 날짜(currentStart)가 얼마나 떨어져 있는지 계산

  // 타입에 따른 이동 가능 여부 연산
  const diff =
    type === "week"
      ? differenceInWeeks(currentStart, initialStart)
      : differenceInMonths(currentStart, initialStart);
  const canMovePrev = diff > -MAX_RANGE;
  const canMoveNext = diff < MAX_RANGE;

  // 주/월 이동
  const move = (direction: "prev" | "next") => {
    if (direction === "prev" && canMovePrev) {
      setCurrentStart((prev) => (type === "week" ? subWeeks(prev, 1) : subMonths(prev, 1)));
    }
    if (direction === "next" && canMoveNext) {
      setCurrentStart((prev) => (type === "week" ? addWeeks(prev, 1) : addMonths(prev, 1)));
    }
  };

  // 월 달력 날짜 배열(이전달 말+현재달+다음달 초)
  const getDaysInMonthGrid = (date: Date) => {
    const startDate = startOfMonth(date); // n월 1일
    const endDate = endOfMonth(date); // n월 30/31일
    return eachDayOfInterval({
      start: startOfWeek(startDate, { weekStartsOn: 0 }), // n월 1일의 주
      end: endOfWeek(endDate, { weekStartsOn: 0 }), // n월 31일의 주
    });
  };

  return {
    currentStart,
    selectedDate,
    setSelectedDate,
    canMovePrev,
    canMoveNext,
    move,
    getDaysInMonthGrid,
  };
}
