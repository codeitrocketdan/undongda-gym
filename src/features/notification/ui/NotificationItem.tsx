"use client";

import { EnrichedNotification } from "@/features/notification/types";
import avatarImage from "@/shared/assets/images/avatar.svg";
import { formatRelativeDate } from "@/shared/lib/formatDate";
import { Dumbbell, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  notification: EnrichedNotification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
  onClose,
}: Props) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const isComment = notification.type === "COMMENT";
  const meetingImage =
    !isComment && notification.data.image && !imageError
      ? notification.data.image
      : null;

  const markReadAndNavigate = () => {
    if (!notification.isRead) onRead(notification.id);
    const href = getHref(notification);
    if (href) {
      onClose();
      router.push(href);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={twMerge(
        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50",
        !notification.isRead && "bg-blue-50/40 hover:bg-blue-50"
      )}
      onClick={markReadAndNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          markReadAndNavigate();
        }
      }}
    >
      {isComment ? (
        <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
          <Image
            src={notification.actorImage || avatarImage}
            alt="프로필"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      ) : meetingImage ? (
        <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200">
          <Image
            src={meetingImage}
            alt="모임 이미지"
            width={40}
            height={40}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-200">
          <Dumbbell size={16} className="text-slate-400" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        {isComment ? (
          <>
            <p className="text-sm">
              {notification.actorLoading ? (
                <span className="inline-block h-3.5 w-16 animate-pulse rounded bg-slate-200 align-middle" />
              ) : (
                <span
                  className={twMerge(!notification.isRead && "font-semibold")}
                >
                  {notification.actorName ?? "알 수 없음"}
                </span>
              )}
              <span className="text-slate-500"> 님이 댓글을 남겼습니다.</span>
            </p>
            {notification.data.commentContent && (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {notification.data.commentContent}
              </p>
            )}
          </>
        ) : (
          <p
            className={twMerge(
              "text-sm leading-snug",
              !notification.isRead && "font-semibold"
            )}
          >
            {notification.message}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          {formatRelativeDate(notification.createdAt)}
        </p>
      </div>

      <button
        className="mt-0.5 shrink-0 cursor-pointer text-slate-300 transition-colors hover:text-slate-500"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function getHref(notification: EnrichedNotification): string | null {
  if (notification.type === "COMMENT" && notification.data.postId) {
    return `/post/${notification.data.postId}`;
  }
  if (notification.type !== "COMMENT" && notification.data.meetingId) {
    return `/dagym-detail/${notification.data.meetingId}`;
  }
  return null;
}
