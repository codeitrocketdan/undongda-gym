import { Bell } from "lucide-react";
import { cn } from "@/shared/lib/cn";

// 로그인 유저 조회 전 알림 벨 자리 표시 (NotificationBell과 같은 크기, 배지 없음)
export default function BellPlaceholder({ className }: { className?: string }) {
  return (
    <span className={cn("p-1 text-gray-300", className)} aria-hidden="true">
      <Bell size={22} />
    </span>
  );
}
