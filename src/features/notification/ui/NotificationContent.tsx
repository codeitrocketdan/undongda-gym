"use client";

import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useEnrichedNotifications,
  useMarkAllRead,
  useMarkRead,
} from "@/features/notification/model/useNotifications";
import { useState } from "react";
import NotificationItem from "./NotificationItem";

type Tab = "unread" | "all";

interface Props {
  onClose: () => void;
}

export default function NotificationContent({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("unread");

  const { data: notifications, isLoading, isError } = useEnrichedNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: deleteOne } = useDeleteNotification();
  const { mutate: deleteAll } = useDeleteAllNotifications();

  const filtered =
    tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="font-semibold text-slate-800">알림</span>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-slate-600"
            onClick={() => markAllRead()}
          >
            모두 읽음
          </button>
          <span className="text-slate-200">|</span>
          <button
            className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-slate-600"
            onClick={() => deleteAll()}
          >
            전체 삭제
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-100">
        {(["unread", "all"] as const).map((t) => (
          <button
            key={t}
            className={`flex-1 cursor-pointer py-2.5 text-sm transition-colors ${
              tab === t
                ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setTab(t)}
          >
            {t === "unread" ? "읽지 않음" : "전체"}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-slate-400">
            불러오는 중...
          </p>
        ) : isError ? (
          <p className="py-12 text-center text-sm text-red-400">
            알림을 불러오지 못했습니다
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            새로운 알림이 없습니다
          </p>
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={markRead}
              onDelete={deleteOne}
              onClose={onClose}
            />
          ))
        )}
      </div>
    </>
  );
}
