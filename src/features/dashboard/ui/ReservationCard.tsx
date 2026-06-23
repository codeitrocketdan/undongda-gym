"use client";
import { getNextDagym } from "@/entities/meeting/lib/getNextDagym";
import { useJoinedMeetings } from "@/entities/meeting/lib/useJoinedMeetings";
import bgCharacter from "@/shared/assets/images/bg_character.png";
import { DATE_FORMAT, format } from "@/shared/lib/date";
import { formatRegion } from "@/shared/lib/formatRegion";
import Skeleton from "@/shared/ui/skeleton/Skeleton";

export default function ReservationCard({ isLogin }: { isLogin: boolean }) {
  const { data: dagyms = [], isLoading } = useJoinedMeetings(isLogin, {
    select: (res) => res.data,
  });
  const nextDagym = getNextDagym(dagyms);

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
        </div>
        <div className="xs:flex-row xs:items-center flex flex-col items-start gap-x-2">
          <p className="flex flex-row flex-wrap items-center gap-x-2 text-lg font-black">
            <span>{formatRegion(nextDagym.region, nextDagym.address)}</span>
            <span>
              {format(nextDagym.dateTime, DATE_FORMAT.TIME)} ~
              {format(nextDagym.dateTime, DATE_FORMAT.TIME_END)}
            </span>
            <span className="text-sm font-medium">
              {format(nextDagym.dateTime, DATE_FORMAT.DATE_WITH_DAY)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
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
