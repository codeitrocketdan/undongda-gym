import { clientFetcher } from "@/shared/api/clientFetcher";
import avatar from "@/shared/assets/images/avatar.svg";
import bannerMobile from "@/shared/assets/images/banner_360.png";
import {
  formatDeadline,
  formatMonthDay,
  formatTime,
} from "@/shared/lib/formatDate";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";
import StatusLabel from "@/shared/ui/status-label/StatusLabel";
import Tag from "@/shared/ui/tag/Tag";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Dagym } from "../model/types";
import DagymHeroActions from "./DagymHeroActions";

export interface ParticipantUser {
  id: number;
  name: string;
  image: string | null;
}

export interface Participant {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  joinedAt: string;
  user: ParticipantUser;
}

export interface ParticipantsResponse {
  data: Participant[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface Props {
  dagym: Dagym;
}

const DagymHero = async ({ dagym }: Props) => {
  const { data: participants } = await clientFetcher.get<ParticipantsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/meetings/1577/participants`
  );

  const visibleParticipants = participants.slice(0, 4);
  const remainCount = participants.length - 4;

  return (
    <section className="mb-20">
      <div className="flex flex-col gap-5 sm:h-[332px] sm:flex-row md:h-[433px]">
        <div className="relative h-[241px] w-full sm:h-full md:w-1/2">
          <Image
            src={dagym.image ?? bannerMobile}
            alt={dagym.name}
            fill
            className="w-full rounded-4xl object-cover"
          />
        </div>

        <div className="flex w-full flex-col gap-5 md:h-full md:w-1/2">
          <FeedCard className="flex h-[282px] flex-col justify-between rounded-[28px] px-10 py-8">
            <div>
              <div className="mb-6 flex gap-1.5">
                <Tag
                  label={formatDeadline(dagym.registrationEnd)}
                  variant="deadline"
                />
                <Tag label={formatMonthDay(dagym.dateTime)} />
                <Tag label={formatTime(dagym.dateTime)} />
              </div>
              <FeedCard.Title
                title={dagym.name}
                className="text-3xl-semibold mb-2"
              />
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {dagym.region} · {dagym.type}
                </span>
              </div>
            </div>
            <DagymHeroActions
              dagymId={dagym.id}
              isFavorited={dagym.isFavorited}
            />
          </FeedCard>

          <div className="h-[141px] rounded-[28px] border border-blue-300 bg-blue-200">
            <div className="px-10 py-7">
              <div className="mb-4 flex justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="text-lg-medium">
                    <span className="text-lg-bold text-blue-500">16</span>명
                    참여
                  </p>
                  <div className="relative h-7.25">
                    {visibleParticipants.map((participant, i) => (
                      <div
                        key={participant.id}
                        className="absolute h-7.25 w-7.25 overflow-hidden rounded-full bg-white"
                        style={{ left: `${i * 16}px` }}
                      >
                        <Image
                          src={participant.user.image ?? avatar}
                          alt="참여 인원 이미지"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {remainCount > 0 && (
                      <div className="relative z-50 ml-8">
                        <p className="text-xs-semibold flex h-7.25 w-7.25 items-center justify-center rounded-full bg-white text-slate-700">
                          +{remainCount}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <StatusLabel />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="text-sm-medium text-slate-600">
                    최소 {dagym.participantCount}명
                  </p>
                  <p className="text-sm-medium text-slate-600">
                    최대 {dagym.capacity}명
                  </p>
                </div>
                <ProgressBar
                  capacity={dagym.capacity}
                  participantCount={dagym.participantCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DagymHero;
