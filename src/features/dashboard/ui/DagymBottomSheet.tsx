"use client";

import type { Dagym } from "@/entities/meeting/types";
import { DATE_FORMAT, format } from "@/shared/lib/date";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import { X } from "lucide-react";
import DagymItem from "./DagymItem";

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
  return (
    <BottomSheet onClose={onClose}>
      <div className="my-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">
          {format(new Date(selectedDateKey), DATE_FORMAT.MONTH_DAY)} 다짐
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
    </BottomSheet>
  );
}
