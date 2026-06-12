"use client";

import { format } from "@/shared/lib/date";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import DagymItem from "./DagymItem";
import type { Dagym } from "../types";

interface DagymBottomSheetProps {
  selectedDateKey: string;
  dagyms: Dagym[];
  onClose: () => void;
}

export default function DagymBottomSheet({
  selectedDateKey,
  dagyms,
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
          {dagyms.map((m) => (
            <DagymItem key={m.id} dagym={m} />
          ))}
        </ul>
      </div>
    </>
  );
}
