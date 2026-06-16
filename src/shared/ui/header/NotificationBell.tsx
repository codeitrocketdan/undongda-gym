"use client";

import NotificationDropdown from "@/features/notification/ui/NotificationDropdown";
import NotificationPanel from "@/features/notification/ui/NotificationPanel";
import { useUnreadCount } from "@/features/notification/model/useNotifications";
import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data } = useUnreadCount();
  const count = data?.count ?? 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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

      <div className="xs:hidden">
        <AnimatePresence>
          {isOpen && <NotificationPanel onClose={close} />}
        </AnimatePresence>
      </div>
      <div className="max-xs:hidden">
        {isOpen && <NotificationDropdown onClose={close} />}
      </div>
    </div>
  );
}
