"use client";

import { format } from "@/shared/lib/date";
import { ChevronLeft } from "lucide-react";
import DagymItem from "./DagymItem";
import type { Dagym } from "../types";

interface DagymDetailPanelProps {
  selectedDateKey: string | null;
  dagyms: Dagym[];
  onBack: () => void;
  isActive: boolean;
}

export default function DagymDetailPanel({
  selectedDateKey,
  dagyms,
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
        {dagyms.map((m) => (
          <DagymItem key={m.id} dagym={m} />
        ))}
      </ul>
    </div>
  );
}
