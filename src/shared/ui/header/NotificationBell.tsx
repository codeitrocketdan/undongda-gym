"use client";

import { Bell } from "lucide-react";

export default function NotificationBell() {
  const hasNotification = false; // TODO: 알림 API 연동 후 교체

  return (
    <button className="relative cursor-pointer p-1">
      <Bell size={22} />
      {hasNotification && (
        <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
      )}
    </button>
  );
}
