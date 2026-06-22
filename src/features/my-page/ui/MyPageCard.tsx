"use client";
import { formatMonthDay, formatTime } from "@/shared/lib/formatDate";
import { formatRegion } from "@/shared/lib/formatRegion";
import {
  getMeetingStatus,
  getMeetingStateText,
} from "@/shared/lib/getMeetingStatus";
import ConfirmBadge from "@/shared/ui/badge/ConfirmBadge";
import StatusBadge from "@/shared/ui/badge/StatusBadge";
import Button from "@/shared/ui/button/Button";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";
import { User } from "lucide-react";
import Link from "next/link";

type CardVariant = "my-dagym" | "my-review" | "created-dagym";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-600">{value}</span>
    </div>
  );
}

interface MyPageCardProps {
  variant: CardVariant;
  id: number;
  image: string | null;
  isFavorited: boolean;
  confirmedAt: string | null;
  canceledAt: string | null;
  isCompleted: boolean;
  title: string;
  region: string;
  address?: string | null;
  dateTime: string | null;
  registrationEnd?: string | null;
  participantCount: number;
  capacity: number;
  onToggleFavorite: () => void;
  onClick?: () => void;
}

export default function MyPageCard({
  variant,
  id,
  image,
  isFavorited,
  confirmedAt,
  canceledAt,
  isCompleted,
  title,
  region,
  address = null,
  dateTime,
  registrationEnd = null,
  participantCount,
  capacity,
  onToggleFavorite,
  onClick,
}: MyPageCardProps) {
  const status = getMeetingStatus({ canceledAt, isCompleted });
  const showBadge = variant === "my-dagym";
  const showCancelButton = variant === "my-dagym" && !isCompleted;
  const showReviewButton = variant === "my-review";

  const overlayText =
    variant === "my-dagym" || variant === "created-dagym"
      ? getMeetingStateText(canceledAt, registrationEnd, participantCount, capacity)
      : null;

  const badges = showBadge && (
    <div className="flex gap-2">
      <StatusBadge status={status} />
      {status === "upcoming" && <ConfirmBadge isConfirmed={!!confirmedAt} />}
    </div>
  );

  const actionButton = (showCancelButton || showReviewButton) && (
    <Button
      variant={showReviewButton ? "primary" : "secondary"}
      size="sm"
      className={`w-auto! ${showCancelButton && !overlayText ? "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" : ""}`}
      isDisabled={showCancelButton && !!overlayText}
      onClick={(e) => {
        e?.preventDefault();
        onClick?.();
      }}
    >
      {showReviewButton
        ? "리뷰 작성하기"
        : overlayText || "예약 취소하기"}
    </Button>
  );

  const metaInfo = (
    <div className="flex shrink-0 flex-col gap-2.5">
      <div className="flex items-center gap-1">
        <User size={16} className="text-slate-500" />
        <span className="text-sm-medium">
          {participantCount}/{capacity}
        </span>
      </div>
      <div className="text-sm-medium flex items-center gap-1.5">
        <MetaItem label="위치" value={formatRegion(region, address)} />
        <span className="text-slate-300">|</span>
        <MetaItem label="날짜" value={formatMonthDay(dateTime)} />
        <span className="text-slate-300">|</span>
        <MetaItem label="시간" value={formatTime(dateTime)} />
      </div>
    </div>
  );

  return (
    <Link href={`/meetings/${id}`}>
      {/* 모바일 */}
      <div className="md:hidden">
        <FeedCard className="w-full overflow-hidden rounded-3xl">
          <div className="relative">
            <FeedCard.Image src={image} className="h-48 w-full rounded-none" />
            {overlayText && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-xl font-bold text-white">
                  {overlayText}
                </span>
              </div>
            )}
            {variant !== "created-dagym" && (
              <div className="absolute top-3 right-3">
                <HeartButton
                  isFavorited={isFavorited}
                  onClick={onToggleFavorite}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 p-4">
            {badges}
            <FeedCard.Title title={title} className="text-xl-semibold" />
            {metaInfo}
            <div className="flex justify-end">{actionButton}</div>
          </div>
        </FeedCard>
      </div>

      {/* 데스크탑 */}
      <div className="hidden md:block">
        <FeedCard className="flex w-full gap-6 rounded-4xl p-6">
          <div className="relative h-50 w-50 shrink-0">
            <FeedCard.Image
              src={image}
              className="h-50 w-50 shrink-0 rounded-xl"
            />
            {overlayText && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
                <span className="text-xl font-bold text-white">
                  {overlayText}
                </span>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="flex justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {badges}
                <FeedCard.Title title={title} className="text-xl-semibold" />
              </div>
              {variant !== "created-dagym" && (
                <HeartButton
                  isFavorited={isFavorited}
                  onClick={onToggleFavorite}
                />
              )}
            </div>
            <div className="flex items-end justify-between">
              {metaInfo}
              {actionButton}
            </div>
          </div>
        </FeedCard>
      </div>
    </Link>
  );
}
