"use client";

import { format } from "@/shared/lib/date";
import { ChevronLeft } from "lucide-react";
import type { CalendarDagym } from "./types";

interface DagymDetailPanelProps {
  selectedDateKey: string | null;
  meetings: CalendarDagym[];
  onBack: () => void;
  isActive: boolean;
}

export default function DagymDetailPanel({
  selectedDateKey,
  meetings,
  onBack,
  isActive,
}: DagymDetailPanelProps) {
  return (
    <div
      className={`w-1/2 ${!isActive ? "pointer-events-none" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="mb-6 flex items-center gap-1">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-full p-1 text-gray-600 hover:bg-gray-100"
          aria-label="캘린더로 돌아가기"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {selectedDateKey
            ? `${format(new Date(selectedDateKey), "M월 d일")} 다짐`
            : ""}
        </h2>
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
  );
}
