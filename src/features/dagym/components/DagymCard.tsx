"use client";
import {
  formatDeadline,
  formatMonthDay,
  formatTime,
} from "@/shared/lib/formatDate";
import { formatRegion } from "@/shared/lib/formatRegion";
import { getMeetingStateText } from "@/shared/lib/getMeetingStatus";
import Button from "@/shared/ui/button/Button";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";
import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import StatusLabel from "@/shared/ui/status-label/StatusLabel";
import Tag from "@/shared/ui/tag/Tag";
import { MapPin, User } from "lucide-react";
import Link from "next/link";
import { DagymCardProps } from "../types";

function JoinButton({
  isOwner,
  canceledAt,
  isJoined,
  registrationEnd,
  participantCount,
  capacity,
  onJoin,
}: Pick<
  DagymCardProps,
  | "isOwner"
  | "canceledAt"
  | "isJoined"
  | "registrationEnd"
  | "participantCount"
  | "capacity"
  | "onJoin"
>) {
  if (isOwner) return null;

  const stateText = getMeetingStateText(
    canceledAt,
    registrationEnd,
    participantCount,
    capacity
  );

  const handleClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    onJoin();
  };

  if (stateText) {
    return (
      <Button size="sm" isDisabled>
        {stateText}
      </Button>
    );
  }

  if (isJoined) {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        onClick={handleClick}
      >
        예약 취소하기
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
      onClick={handleClick}
    >
      참여하기
    </Button>
  );
}

export default function DagymCard({
  id,
  image,
  isFavorited,
  confirmedAt,
  canceledAt,
  isJoined,
  isOwner = false,
  title,
  region,
  address = null,
  type,
  dateTime,
  registrationEnd,
  participantCount,
  capacity,
  onToggleFavorite,
  onJoin,
}: DagymCardProps) {
  const joinButtonProps = {
    isOwner,
    canceledAt,
    isJoined,
    registrationEnd,
    participantCount,
    capacity,
    onJoin,
  };

  const overlayText = getMeetingStateText(
    canceledAt,
    registrationEnd,
    participantCount,
    capacity
  );

  return (
    <Link href={`/dagym-detail/${id}`}>
      <FeedCard className="overflow-hidden rounded-3xl md:rounded-4xl">
        {/* 모바일 레이아웃 */}
        <div className="flex flex-col md:hidden">
          <div className="relative">
            <FeedCard.Image src={image} className="h-48 w-full" />
            {overlayText && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-xl font-bold text-white">
                  {overlayText}
                </span>
              </div>
            )}
            {!isOwner && (
              <div className="absolute top-3 right-3 z-10">
                <HeartButton
                  isFavorited={isFavorited}
                  onClick={onToggleFavorite}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div>
              <div className="flex min-w-0 items-center gap-1">
                <FeedCard.Title
                  title={title}
                  className="text-base-semibold min-w-0 truncate"
                />
                {confirmedAt && !canceledAt && <StatusLabel />}
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {formatRegion(region, address)} · {type}
                </span>
              </div>
            </div>
            <div className="flex gap-0.5">
              <Tag label={formatMonthDay(dateTime)} />
              <Tag label={formatTime(dateTime)} />
              <Tag label={formatDeadline(registrationEnd)} variant="deadline" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <User size={16} className="shrink-0 text-slate-400" />
                <ProgressBar
                  capacity={capacity}
                  participantCount={participantCount}
                />
                <div className="shrink-0 text-sm">
                  <span className="text-blue-500">{participantCount}</span>
                  <span className="text-slate-600">/{capacity}</span>
                </div>
              </div>
              <div className="shrink-0">
                <JoinButton {...joinButtonProps} />
              </div>
            </div>
          </div>
        </div>

        {/* 태블릿/데스크탑 레이아웃 */}
        <div className="relative hidden h-55 p-6 md:flex">
          <div className="relative h-42.5 w-42.5 shrink-0">
            <FeedCard.Image src={image} className="h-42.5 w-42.5 rounded-3xl" />
            {overlayText && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60">
                <span className="text-xl font-bold text-white">
                  {overlayText}
                </span>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between py-4 pl-4">
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex min-w-0 items-center gap-1 pr-12">
                  <FeedCard.Title
                    title={title}
                    className="text-xl-semibold min-w-0 truncate"
                  />
                  {confirmedAt && !canceledAt && <StatusLabel />}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {formatRegion(region, address)} · {type}
                  </span>
                </div>
              </div>
              {!isOwner && (
                <div className="absolute top-4 right-4 z-10 hidden md:block">
                  <HeartButton
                    isFavorited={isFavorited}
                    onClick={onToggleFavorite}
                  />
                </div>
              )}
            </div>
            <div className="flex items-end gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex shrink-0 flex-nowrap gap-0.5">
                  <Tag label={formatMonthDay(dateTime)} />
                  <Tag label={formatTime(dateTime)} />
                  <Tag
                    label={formatDeadline(registrationEnd)}
                    variant="deadline"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={16} className="shrink-0 text-slate-400" />
                  <ProgressBar
                    capacity={capacity}
                    participantCount={participantCount}
                  />
                  <div className="shrink-0 text-sm">
                    <span className="text-blue-500">{participantCount}</span>
                    <span className="text-slate-600">/{capacity}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <JoinButton {...joinButtonProps} />
              </div>
            </div>
          </div>
        </div>
      </FeedCard>
    </Link>
  );
}

// 로딩시 스켈레톤
export function DagymCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white md:rounded-4xl">
      <div className="flex flex-col md:hidden">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-8 w-20 self-end" />
        </div>
      </div>
      <div className="relative hidden h-55 gap-4 p-6 md:flex">
        <Skeleton className="h-42.5 w-42.5 shrink-0 rounded-3xl" />
        <div className="flex flex-1 flex-col justify-between py-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-8 w-20 self-end" />
        </div>
      </div>
    </div>
  );
}
