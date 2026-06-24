import type { Dagym } from "@/entities/meeting/types";
import { DATE_FORMAT, format } from "@/shared/lib/date";

export default function DagymItem({ dagym }: { dagym: Dagym }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900">
          {dagym.name}
        </span>
        <span className="text-xs text-gray-400">
          {format(new Date(dagym.dateTime), DATE_FORMAT.TIME)} ~
          {format(new Date(dagym.dateTime), DATE_FORMAT.TIME_END)}
        </span>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          dagym.isCompleted && dagym.confirmedAt
            ? "bg-blue-100 text-blue-700"
            : "bg-orange-100 text-orange-600"
        }`}
      >
        {dagym.isCompleted && dagym.confirmedAt ? "완료" : "예정"}
      </span>
    </li>
  );
}
