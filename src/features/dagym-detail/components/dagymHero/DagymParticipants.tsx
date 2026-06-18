"use client";
import { clientFetcher } from "@/shared/api/clientFetcher";
import avatar from "@/shared/assets/images/avatar.svg";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ParticipantsResponse } from "../../model/types";

interface Props {
  meetingId: string;
}

export const DagymParticipants = ({ meetingId }: Props) => {
  const { data: participants = [] } = useQuery({
    queryKey: ["dagym-detail", meetingId, "participants"],
    queryFn: async () => {
      const { data } = await clientFetcher.get<ParticipantsResponse>(
        `/api/meetings/${meetingId}/participants`
      );

      return data;
    },
  });
  console.log(meetingId);
  const visibleParticipants = participants.slice(0, 4);

  const remainCount = Math.max(
    participants.length - visibleParticipants.length,
    0
  );

  return (
    <div className="relative h-7.25">
      {visibleParticipants.map((participant, i) => (
        <div
          key={participant.id}
          className="absolute h-7.25 w-7.25 overflow-hidden rounded-full bg-white"
          style={{ left: `${i * 16}px` }}
        >
          <Image
            src={participant.user.image ?? avatar}
            alt={participant.user.name}
            fill
            className="object-cover"
          />
        </div>
      ))}

      {remainCount > 0 && (
        <div
          className="absolute z-10"
          style={{ left: `${visibleParticipants.length * 16}px` }}
        >
          <div className="text-xs-semibold flex h-7.25 w-7.25 items-center justify-center rounded-full bg-white text-slate-700">
            +{remainCount}
          </div>
        </div>
      )}
    </div>
  );
};
