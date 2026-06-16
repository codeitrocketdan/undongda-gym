"use client";

import NotificationContent from "./NotificationContent";

interface Props {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: Props) {
  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      <NotificationContent onClose={onClose} />
    </div>
  );
}
