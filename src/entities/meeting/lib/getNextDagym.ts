import type { Dagym } from "../types";

export function getNextDagym(meetings: Dagym[]): Dagym | null {
  const now = new Date();
  return (
    meetings
      .filter((dagym) => !dagym.isCompleted && new Date(dagym.dateTime) >= now)
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      )[0] ?? null
  );
}
