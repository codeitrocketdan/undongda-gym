import { MeetingStatus } from "@/shared/lib/getMeetingStatus";
import { twMerge } from "tailwind-merge";

type Status = MeetingStatus;

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  upcoming: {
    label: "이용예정",
    className: "bg-blue-200 text-blue-600",
  },
  completed: {
    label: "이용완료",
    className: "bg-slate-100 text-slate-600",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusConfig[status];

  return (
    <div
      className={twMerge(
        "flex min-w-max items-center justify-center rounded-3xl px-3 py-1.5 text-sm",
        className
      )}
    >
      {label}
    </div>
  );
}
