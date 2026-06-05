import { Check } from "lucide-react";

export default function StatusLabel() {
  return (
    <div className="flex min-w-max items-center justify-center gap-0.5">
      <Check
        size={14}
        className="gradient-blue rounded-full text-white md:size-4"
      />
      <span className="text-xs text-blue-600 md:text-sm">개설확정</span>
    </div>
  );
}
