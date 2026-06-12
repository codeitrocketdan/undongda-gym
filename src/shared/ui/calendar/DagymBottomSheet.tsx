"use client";

import { format } from "@/shared/lib/date";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import type { CalendarDagym } from "./types";

interface DagymBottomSheetProps {
  selectedDateKey: string;
  meetings: CalendarDagym[];
  onClose: () => void;
}

export default function DagymBottomSheet({
  selectedDateKey,
  meetings,
  onClose,
}: DagymBottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setDragY(delta);
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? "transform 0.3s ease-out" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white px-5 pt-3 pb-8 shadow-xl"
      >
        {/* 드래그 핸들 */}
        <div className="mb-3 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <div className="my-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">
            {format(new Date(selectedDateKey), "M월 d일")} 다짐
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        <ul className="flex flex-col gap-3">
          {meetings.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-900">
                  {m.name}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(m.dateTime), "HH:mm")} ~{" "}
                  {format(new Date(m.dateTime), "HH:50")}
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  m.isCompleted
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {m.isCompleted ? "완료" : "예정"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
