import type { Dagym } from "@/entities/meeting/types";
import { format, isSameMonth, subDays } from "@/shared/lib/date";

export function calculateThisMonthCount(meetings: Dagym[]): number {
  const now = new Date();
  return meetings.filter((meeting) =>
    isSameMonth(new Date(meeting.dateTime), now)
  ).length;
}

export function calculateTotalHours(meetings: Dagym[]): number {
  const MEETING_HOURS_PER_SESSION = 1;
  return calculateThisMonthCount(meetings) * MEETING_HOURS_PER_SESSION;
}

export function calculateStreak(meetings: Dagym[]): number {
  const uniqueDates = Array.from(
    new Set(meetings.map((m) => format(new Date(m.dateTime))))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const todayStr = format(now);
  const yesterdayStr = format(subDays(now, 1));

  const startDateStr = uniqueDates.includes(todayStr) ? todayStr : yesterdayStr;
  let currentCheck = new Date(startDateStr);
  let streak = 0;

  while (true) {
    const dateStr = format(currentCheck);
    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentCheck = subDays(currentCheck, 1);
    } else {
      break;
    }
  }

  return streak;
}
