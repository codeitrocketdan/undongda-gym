"use client";
import bgCharacter from "@/shared/assets/images/bg_character.png";
import { format } from "@/shared/lib/date";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Dagym } from "../types";

interface ApiResponse {
  data: Dagym[];
}

function ReservationCardSkeleton() {
  return (
    <div className="inner">
      <div className="w-full rounded-xl bg-white p-6 pr-18 shadow-lg">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-14 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
async function fetchMeetings(): Promise<ApiResponse> {
  const response = await fetch("/api/users/me/meetings");
  if (!response.ok) throw new Error(`서버 에러 상태코드: ${response.status}`);
  return response.json();
}

export default function ReservationCard({ isLogin }: { isLogin: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ["joinedDagyms"],
    queryFn: fetchMeetings,
    enabled: isLogin,
  });

  const now = new Date();
  const nextDagym =
    data?.data
      ?.filter((dagym) => !dagym.isCompleted && new Date(dagym.dateTime) >= now)
      .sort(
        (earlier, later) =>
          new Date(earlier.dateTime).getTime() - new Date(later.dateTime).getTime()
      )[0] ?? null;

  if (isLoading) return <ReservationCardSkeleton />;
  if (!nextDagym) return null;

  return (
    <div className="inner">
      <div
        style={{ backgroundImage: `url(${bgCharacter.src})` }}
        className="bg-image w-full rounded-xl bg-white bg-[size:81px_80px] bg-[position:right_bottom] bg-no-repeat p-6 pr-18 shadow-lg"
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-black text-gray-800">예약된 다짐</span>
          <span className="color-slate-800 rounded-xl bg-slate-200 px-2 py-1 text-sm">
            {nextDagym.type}
          </span>
          {/* <p className="text-base">- {nextDagym.name}</p> */}
        </div>
        <div className="xs:flex-row xs:items-center flex flex-col items-start gap-x-2">
          <p className="flex flex-row flex-wrap items-center gap-x-2 text-lg font-black">
            <span>{nextDagym.region}점</span>
            <span>
              {format(nextDagym.dateTime, "HH:mm")} ~{" "}
              {format(nextDagym.dateTime, "HH:50")}
            </span>
            <span className="text-sm font-medium">
              {format(nextDagym.dateTime, "yyyy-MM-dd(eee)")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
