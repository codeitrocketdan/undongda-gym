import { Check } from "lucide-react";

export default function StatusLabel() {
  return (
    <div className="flex min-w-max items-center justify-center gap-0.5">
      <Check
        size={14}
        className="bg-gradient-blue-500 rounded-full text-white md:size-4.5"
      />
      <span className="text-xs text-blue-600 md:text-sm">개설확정</span>
    </div>
  );
}
