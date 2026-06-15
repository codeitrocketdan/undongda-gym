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
  const uniqueDates = new Set(meetings.map((m) => format(new Date(m.dateTime))));

  if (uniqueDates.size === 0) return 0;

  const now = new Date();
  const todayStr = format(now);

  let currentCheck = uniqueDates.has(todayStr) ? now : subDays(now, 1);
  let streak = 0;

  while (true) {
    const dateStr = format(currentCheck);
    if (uniqueDates.has(dateStr)) {
      streak++;
      currentCheck = subDays(currentCheck, 1);
    } else {
      break;
    }
  }

  return streak;
}
