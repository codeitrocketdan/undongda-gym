"use client";
import {
  formatDeadline,
  formatMonthDay,
  formatTime,
} from "@/shared/lib/formatDate";
import { formatRegion } from "@/shared/lib/formatRegion";
import Button from "@/shared/ui/button/Button";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";
import Tag from "@/shared/ui/tag/Tag";
import { MapPin } from "lucide-react";
import { DagymDetailCardProps } from "../types";

export default function DagymDetailCard({
  title,
  region,
  address = null,
  type,
  dateTime,
  registrationEnd,
  isFavorited,
  onToggleFavorite,
  onJoin,
}: DagymDetailCardProps) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl bg-white p-6 md:p-10">
      <div className="flex flex-nowrap gap-1">
        <Tag label={formatDeadline(registrationEnd)} variant="deadline" />
        <Tag label={formatMonthDay(dateTime)} />
        <Tag label={formatTime(dateTime)} />
      </div>

      <div>
        <FeedCard.Title
          className="text-lg-semibold md:text-xl-semibold truncate"
          title={title}
        />

        <div className="md:text-base-medium text-sm-medium flex items-center gap-1 text-slate-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {formatRegion(region, address)} · {type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 md:gap-4">
        <HeartButton
          isFavorited={isFavorited}
          onClick={onToggleFavorite}
          size="md"
        />
        <Button variant="primary" size="sm" className="flex-1" onClick={onJoin}>
          참여하기
        </Button>
      </div>
    </div>
  );
}
