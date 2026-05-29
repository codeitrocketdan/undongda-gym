import { format } from "date-fns";

/**
 * 2026.05.18 형식으로 날짜 포맷팅
 * @param date
 * @returns
 */
export function formatDate(date: string | null) {
  if (!date) return "";
  return format(new Date(date), "yyyy.MM.dd");
}

/**
 * 3분전, 5시간 전 등으로 날짜 포맷팅
 * @param date
 * @returns
 */
export function formatRelativeDate(date: string | null) {
  if (!date) return "";

  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();

  if (diffMs < 0) return formatDate(date); // 미래면 그냥 날짜로 표시

  const diffMin = Math.floor(diffMs / 1000 / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 5) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return formatDate(date);
}

/**
 * M월 d일 형식으로 날짜 포맷팅
 */
export function formatMonthDay(date: string | null) {
  if (!date) return "";
  return format(new Date(date), "M월 d일");
}

/**
 * HH:mm 형식으로 시간 포맷팅
 */
export function formatTime(date: string | null) {
  if (!date) return "";
  return format(new Date(date), "HH:mm");
}

/**
 * 마감일 포맷팅
 * 마감: "마감"
 * 오늘 마감: "오늘 21시 마감"
 * 내일 마감: "내일 마감"
 * 이후 마감: "13일 후 마감"
 */
export function formatDeadline(date: string | null) {
  if (!date) return "";

  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 1000 / 60 / 60 / 24);

  if (diffMs < 0) return "마감";
  if (diffDays < 1) return `오늘 ${format(target, "H")}시 마감`;
  if (diffDays === 1) return "내일 마감";
  return `${diffDays}일 후 마감`;
}
