import { format } from "@/shared/lib/date";
import type { Dagym } from "../types";

export default function DagymItem({ dagym }: { dagym: Dagym }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900">
          {dagym.name}
        </span>
        <span className="text-xs text-gray-400">
          {format(new Date(dagym.dateTime), "HH:mm")} ~{" "}
          {format(new Date(dagym.dateTime), "HH:50")}
        </span>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          dagym.isCompleted
            ? "bg-blue-100 text-blue-700"
            : "bg-orange-100 text-orange-600"
        }`}
      >
        {dagym.isCompleted ? "완료" : "예정"}
      </span>
    </li>
  );
}
