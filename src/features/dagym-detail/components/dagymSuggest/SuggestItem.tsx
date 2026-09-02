"use client";

import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";

import {
  formatDeadline,
  formatMonthDay,
  formatTime,
} from "@/shared/lib/formatDate";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";
import Tag from "@/shared/ui/tag/Tag";
import { useFavoriteMutation } from "../../api/useFavoriteMutation";
import { Meeting } from "../../model/types";

const LoginModal = dynamic(() => import("@/shared/ui/modal/LoginModal"), {
  ssr: false,
});

interface Props {
  meeting: Meeting;
}

const SuggestItem = ({ meeting }: Props) => {
  const { requireAuth, loginModal } = useRequireAuth();
  const { mutate: toggleFavorite } = useFavoriteMutation(meeting.id.toString());

  const handleClick = () => {
    requireAuth(() => toggleFavorite(meeting.isFavorited));
  };

  return (
    <>
      <Link href={`/dagym-detail/${meeting.id}`}>
        <FeedCard className="flex h-[282px] flex-col justify-between rounded-[28px] bg-transparent">
          {/* image */}
          <div className="relative mb-3.5 h-[241px] w-full">
            <Image
              fill
              src={meeting.image ?? ""}
              alt={meeting.name}
              className="rounded-3xl object-cover"
            />

            <HeartButton
              className="absolute right-5 bottom-5 z-50"
              isFavorited={meeting.isFavorited}
              onClick={handleClick}
            />
          </div>

          {/* content */}
          <div>
            <div className="mb-4 flex gap-1.5">
              <Tag
                label={formatDeadline(meeting.registrationEnd)}
                variant="deadline"
              />
              <Tag label={formatMonthDay(meeting.dateTime)} />
              <Tag label={formatTime(meeting.dateTime)} />
            </div>

            <FeedCard.Title
              title={meeting.name}
              className="text-xl-semibold mb-2"
            />

            <div className="flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {meeting.region} · {meeting.type}
              </span>
            </div>
          </div>
        </FeedCard>
      </Link>
      {loginModal.isOpen && <LoginModal onClose={loginModal.close} />}
    </>
  );
};

export default SuggestItem;
