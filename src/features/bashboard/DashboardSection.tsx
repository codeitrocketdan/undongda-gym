"use client";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "./DashboardCard";
import { calculateDashboardStats } from "./lib/useDashboardCard";

export interface Meeting {
  id: number;
  dateTime: string;
  isCompleted: boolean;
}

// API 응답 데이터 전체를 받을 State 타입 정의
interface ApiResponse {
  data: Meeting[];
}

function DashboardCardSkeleton() {
  return (
    <div className="flex min-w-[240px] flex-1 items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
      {/* 아이콘이 들어갈 사각형 스켈레톤 */}
      <Skeleton className="h-10 w-10 rounded-xl" />

      {/* 텍스트(타이틀 + 숫자)가 들어갈 영역 */}
      <div className="flex flex-1 flex-col gap-2">
        {/* 타이틀 자리 (연속 다짐 등) */}
        <Skeleton className="h-4 w-16" />
        {/* 숫자 + 단위 자리 */}
        <Skeleton className="h-7 w-24" />
      </div>
    </div>
  );
}

async function fetchJoinedMeetings(): Promise<ApiResponse> {
  const response = await fetch("/api/users/me/meetings");
  if (!response.ok) throw new Error(`서버 에러 상태코드: ${response.status}`);
  return response.json();
}

export default function DashboardCardSection({
  isLogin,
}: {
  isLogin: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["joinedMeetings"],
    queryFn: fetchJoinedMeetings,
    enabled: isLogin,
  });

  const stats = data?.data
    ? calculateDashboardStats(data.data.filter((m) => m.isCompleted))
    : { streak: 0, thisMonthCount: 0, totalHours: 0 };

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
      {/* 연속 다짐 */}
      <DashboardCard
        type="streak"
        title="연속 다짐"
        //value={3}
        value={stats.streak}
        unit="일 째"
      />

      {/* 다짐 횟수 */}
      <DashboardCard
        type="count"
        title="다짐 횟수"
        //value={12}
        value={stats.thisMonthCount}
        unit="회"
      />

      {/* 다짐 시간 */}
      <DashboardCard
        type="time"
        title="다짐 시간"
        //value={18}
        value={stats.totalHours}
        unit="시간"
      />
    </div>
  );
}
