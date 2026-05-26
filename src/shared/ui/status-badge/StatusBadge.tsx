import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Status = "upcoming" | "completed" | "pending" | "confirmed";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  upcoming: {
    label: "이용예정",
    className: "bg-blue-200 text-blue-600",
  },
  pending: {
    label: "개설대기",
    className: "bg-slate-100 text-slate-600",
  },
  completed: {
    label: "이용완료",
    className: "bg-slate-100 text-slate-600",
  },
  confirmed: {
    label: "개설확정",
    className: "",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusConfig[status];

  if (status === "confirmed") {
    return (
      <div className="flex min-w-max items-center justify-center gap-0.5 rounded-3xl border border-blue-500 px-3 py-1.5">
        <Check
          size={18}
          className="bg-gradient-blue-500 rounded-full text-white"
        />
        <span className="text-sm text-blue-600">{label}</span>
      </div>
    );
  }
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
