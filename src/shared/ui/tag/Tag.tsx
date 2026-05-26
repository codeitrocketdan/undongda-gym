import { AlarmClock } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface TagProps {
  label: string;
  variant?: "deadline" | "default";
}

const variantConfig = {
  deadline:
    "bg-green-100 text-xs font-semibold text-green-800 md:text-sm md:font-semibold",
  default:
    "border border-slate-200 text-xs font-medium text-slate-600 md:text-sm",
};

export default function Tag({ label, variant = "default" }: TagProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center gap-1 rounded-md px-2 py-0.5 md:rounded-lg",
        variantConfig[variant]
      )}
    >
      {variant === "deadline" && (
        <AlarmClock size={11} className="md:size-3.5" />
      )}
      <span>{label}</span>
    </div>
  );
}
