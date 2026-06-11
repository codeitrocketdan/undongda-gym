"use client";
import bgCharacter from "@/shared/assets/images/bg_character.png";
import { format } from "@/shared/lib/date";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { useQuery } from "@tanstack/react-query";

interface Meeting {
  id: number;
  name: string;
  type: string;
  region: string;
  dateTime: string;
  isCompleted: boolean;
}

interface ApiResponse {
  data: Meeting[];
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
    queryKey: ["joinedMeetings"],
    queryFn: fetchMeetings,
    enabled: isLogin,
  });

  const now = new Date();
  const meeting =
    data?.data
      ?.filter((m) => !m.isCompleted && new Date(m.dateTime) >= now)
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      )[0] ?? null;

  if (isLoading) return <ReservationCardSkeleton />;
  if (!meeting) return null;

  return (
    <div className="inner">
      <div
        style={{ backgroundImage: `url(${bgCharacter.src})` }}
        className="bg-image w-full rounded-xl bg-white bg-[size:81px_80px] bg-[position:right_bottom] bg-no-repeat p-6 pr-18 shadow-lg"
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-black text-gray-800">예약된 다짐</span>
          <span className="color-slate-800 rounded-xl bg-slate-200 px-2 py-1 text-sm">
            {meeting.type}
          </span>
          {/* <p className="text-base">- {meeting.name}</p> */}
        </div>
        <div className="xs:flex-row xs:items-center flex flex-col items-start gap-x-2">
          <p className="flex flex-row flex-wrap items-center gap-x-2 text-lg font-black">
            <span>{meeting.region}점</span>
            <span>
              {format(meeting.dateTime, "HH:mm")} ~{" "}
              {format(meeting.dateTime, "HH:50")}
            </span>
            <span className="text-sm font-medium">
              {format(meeting.dateTime, "yyyy-MM-dd(eee)")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
