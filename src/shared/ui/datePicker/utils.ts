import { format } from "date-fns";

export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

// 오늘 생성하는 다짐은 현재 시각 기준 이 시간 이후부터만 선택 가능
export const MIN_BOOKING_LEAD_HOURS = 3;

export const formatDate = (date?: Date) => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

export const formatTime = (hour: number, minute: number) => {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

// api 호출 시 형태
export const toISOStringFromLocal = (date: Date, time: string) => {
  if (!/^\d{2}:\d{2}$/.test(time)) return "";
  const dateStr = formatDate(date);
  const timeStr = time;

  const combinedDate = new Date(`${dateStr}T${timeStr}:00`);
  if (Number.isNaN(combinedDate.getTime())) return "";
  return combinedDate.toISOString();
};

const getMinSelectableDate = (minLeadHours: number) =>
  new Date(Date.now() + minLeadHours * 60 * 60 * 1000);

export const isPastHour = (
  selectedDate?: Date,
  hour?: number,
  minLeadHours: number = MIN_BOOKING_LEAD_HOURS
) => {
  if (!selectedDate || hour === undefined) return false;

  // 그 시간대의 마지막 분(59분)까지가 선택 가능 시각보다 이전이면 통째로 막힘
  const candidateHourEnd = new Date(selectedDate);
  candidateHourEnd.setHours(hour, 59, 0, 0);

  return candidateHourEnd < getMinSelectableDate(minLeadHours);
};

export const isPastMinute = (
  selectedDate?: Date,
  hour?: number,
  minute?: number,
  minLeadHours: number = MIN_BOOKING_LEAD_HOURS
) => {
  if (!selectedDate || hour === undefined || minute === undefined) {
    return false;
  }

  const candidate = new Date(selectedDate);
  candidate.setHours(hour, minute, 0, 0);

  return candidate < getMinSelectableDate(minLeadHours);
};
