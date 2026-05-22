import { format } from "date-fns";

export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export const formatDate = (date?: Date) => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

export const formatTime = (hour: number, minute: number) => {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

// api 호출 시 형태
export const toISOStringFromLocal = (date: Date, time: string) => {
  const dateStr = formatDate(date);
  const timeStr = time;

  const combinedDate = new Date(`${dateStr}T${timeStr}:00`);
  return combinedDate.toISOString();
};

export const isPastHour = (selectedDate?: Date, hour?: number) => {
  if (!selectedDate || hour === undefined) return false;

  const now = new Date();

  // 오늘 아니면 제한 없음
  if (selectedDate.toDateString() !== now.toDateString()) {
    return false;
  }

  return hour < now.getHours();
};

export const isPastMinute = (
  selectedDate?: Date,
  hour?: number,
  minute?: number
) => {
  if (!selectedDate || hour === undefined || minute === undefined) {
    return false;
  }

  const now = new Date();

  // 오늘 아니면 제한 없음
  if (selectedDate.toDateString() !== now.toDateString()) {
    return false;
  }

  // 현재 시간보다 미래 hour면 제한 없음
  if (hour > now.getHours()) {
    return false;
  }

  // 이전 hour는 막힘
  if (hour < now.getHours()) {
    return true;
  }

  // 같은 hour일 때만 minute 비교
  return minute < now.getMinutes();
};
