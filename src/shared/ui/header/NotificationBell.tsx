"use client";

import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useUnreadCount } from "@/features/notification/model/useNotifications";
import { XS_BREAKPOINT } from "@/shared/constants/breakpoints";

const NotificationContent = dynamic(
  () => import("@/features/notification/ui/NotificationContent"),
  { ssr: false }
);
const NotificationPanel = dynamic(
  () => import("@/features/notification/ui/NotificationPanel"),
  { ssr: false }
);

function subscribeToMediaQuery(callback: () => void) {
  const mq = window.matchMedia(XS_BREAKPOINT);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data } = useUnreadCount();
  const count = data?.count ?? 0;

  const isDesktop = useSyncExternalStore(
    subscribeToMediaQuery,
    () => window.matchMedia(XS_BREAKPOINT).matches,
    () => false
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        className="relative cursor-pointer p-1"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell size={22} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {isDesktop ? (
        isOpen && (
          <div className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <NotificationContent onClose={close} />
          </div>
        )
      ) : (
        <AnimatePresence>
          {isOpen && <NotificationPanel onClose={close} />}
        </AnimatePresence>
      )}
    </div>
  );
}
