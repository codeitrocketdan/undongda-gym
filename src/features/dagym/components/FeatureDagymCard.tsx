"use client";
import {
  formatDeadline,
  formatMonthDay,
  formatTime,
} from "@/shared/lib/formatDate";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";
import Tag from "@/shared/ui/tag/Tag";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { FeatureDagymCardProps } from "../types";

export default function FeatureDagymCard({
  id,
  image,
  isFavorited,
  dateTime,
  registrationEnd,
  title,
  region,
  type,
  onToggleFavorite,
}: FeatureDagymCardProps) {
  return (
    <Link href={`/dagym-detail/${id}`}>
      <FeedCard className="flex w-40.5 flex-col gap-2.5 md:w-75.5 md:gap-3.5">
        <div className="relative">
          <FeedCard.Image
            src={image}
            className="h-40.5 w-full rounded-xl md:h-45 md:rounded-3xl"
          />
          <div className="absolute right-2 bottom-2">
            <HeartButton
              isFavorited={isFavorited}
              onClick={onToggleFavorite}
              size="md"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 md:flex-row md:gap-1.5">
          <Tag label={formatDeadline(registrationEnd)} variant="deadline" />
          <div className="flex gap-1">
            <Tag label={formatMonthDay(dateTime)} />
            <Tag label={formatTime(dateTime)} />
          </div>
        </div>

        <div>
          <FeedCard.Title
            title={title}
            className="text-base-bold md:text-xl-bold mb-0.5"
          />
          <div className="flex items-center gap-1 text-xs text-slate-500 md:text-sm">
            <MapPin className="h-3 w-3" />
            <span>
              {region} · {type}
            </span>
          </div>
        </div>
      </FeedCard>
    </Link>
  );
}
