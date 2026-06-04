import { Check } from "lucide-react";

interface ConfirmBadgeProps {
  isConfirmed: boolean;
}

export default function ConfirmBadge({ isConfirmed }: ConfirmBadgeProps) {
  if (isConfirmed) {
    return (
      <div className="flex min-w-max items-center justify-center gap-0.5 rounded-3xl border border-blue-500 px-3 py-1.5">
        <Check
          size={18}
          className="bg-gradient-blue-500 rounded-full text-white"
        />
        <span className="text-sm text-blue-600">개설확정</span>
      </div>
    );
  }

  return (
    <div className="flex min-w-max items-center justify-center rounded-3xl bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
      개설대기
    </div>
  );
}
