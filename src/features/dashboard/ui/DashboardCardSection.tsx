"use client";
import { useJoinedMeetings } from "@/entities/meeting/lib/useJoinedMeetings";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import {
  calculateStreak,
  calculateThisMonthCount,
  calculateTotalHours,
} from "../model/useDashboardCard";
import { DashboardCard } from "./DashboardCard";

export default function DashboardCardSection({
  isLogin,
}: {
  isLogin: boolean;
}) {
  const { data: completedMeetings = [], isLoading } = useJoinedMeetings(isLogin, {
    select: (res) => res.data.filter((dagym) => dagym.isCompleted),
  });

  const streak = calculateStreak(completedMeetings);
  const thisMonthCount = calculateThisMonthCount(completedMeetings);
  const totalHours = calculateTotalHours(completedMeetings);

  if (isLoading) {
    return (
      <div className="inner flex justify-between gap-2 md:flex-row md:gap-4">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>
    );
  }

  return (
    <div className="inner flex justify-between gap-2 md:flex-row md:gap-4">
      <DashboardCard
        type="streak"
        title="연속 다짐"
        value={streak}
        unit="일 째"
      />

      <DashboardCard
        type="count"
        title="다짐 횟수"
        value={thisMonthCount}
        unit="회"
      />

      <DashboardCard
        type="time"
        title="다짐 시간"
        value={totalHours}
        unit="시간"
      />
    </div>
  );
}

function DashboardCardSkeleton() {
  return (
    <div className="flex min-w-[240px] flex-1 items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
      <Skeleton className="h-10 w-10 rounded-xl" />

      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-7 w-24" />
      </div>
    </div>
  );
}
