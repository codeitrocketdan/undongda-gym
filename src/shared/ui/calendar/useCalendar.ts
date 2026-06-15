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

const MAX_RANGE = 2;

type CalendarType = "week" | "month";

export function useCalendar(TODAY: Date, type: CalendarType = "week") {
  const initialStart = useMemo(() => {
    return type === "week"
      ? startOfWeek(TODAY, { weekStartsOn: 0 })
      : startOfMonth(TODAY);
  }, [TODAY, type]);

  const { prevRange, nextRange, initialActiveIndex } = useMemo(() => {
    if (type === "month") {
      return {
        prevRange: MAX_RANGE,
        nextRange: MAX_RANGE,
        initialActiveIndex: MAX_RANGE,
      };
    }

    const monthStart = startOfMonth(TODAY);
    const monthEnd = endOfMonth(TODAY);

    const prevRange = Math.abs(
      differenceInCalendarWeeks(initialStart, monthStart, { weekStartsOn: 0 })
    );
    const nextRange = Math.abs(
      differenceInCalendarWeeks(monthEnd, initialStart, { weekStartsOn: 0 })
    );

    return {
      prevRange,
      nextRange,
      initialActiveIndex: prevRange,
    };
  }, [TODAY, initialStart, type]);

  const calendarSlides = useMemo(() => {
    const slides = [];
    for (let i = -prevRange; i <= nextRange; i++) {
      const baseDate =
        type === "week"
          ? addWeeks(initialStart, i)
          : addMonths(initialStart, i);

      const startDate =
        type === "week"
          ? startOfWeek(baseDate, { weekStartsOn: 0 })
          : startOfMonth(baseDate);
      const endDate =
        type === "week"
          ? endOfWeek(baseDate, { weekStartsOn: 0 })
          : endOfMonth(baseDate);

      const gridStart =
        type === "week"
          ? startDate
          : startOfWeek(startDate, { weekStartsOn: 0 });
      const gridEnd =
        type === "week" ? endDate : endOfWeek(endDate, { weekStartsOn: 0 });

      const days = [];
      const current = new Date(gridStart);
      while (current <= gridEnd) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      slides.push({
        id: format(baseDate, type === "week" ? "yyyy-II" : "yyyy-MM"),
        baseDate,
        days,
      });
    }
    return slides;
  }, [initialStart, type, prevRange, nextRange]);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [selectedDate, setSelectedDate] = useState(() => TODAY);

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
