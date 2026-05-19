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
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 5) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return formatDate(date);
}
