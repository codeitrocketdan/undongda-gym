"use client";

import { useFocusTrap } from "@/shared/lib/useFocusTrap";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import NotificationContent from "./NotificationContent";

interface Props {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: Props) {
  const trapRef = useFocusTrap<HTMLDivElement>();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black"
      />
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="알림"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl"
      >
        <div className="flex justify-end px-5 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer p-1"
            aria-label="알림 닫기"
            autoFocus
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NotificationContent onClose={onClose} />
        </div>
      </motion.div>
    </>
  );
}
