import { Calendar, Clock, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CardType = "streak" | "count" | "time";

export interface CardStyleConfig {
  icon: LucideIcon;
  iconClass: string;
  valueClass: string;
}

export const CARD_CONFIGS: Record<CardType, CardStyleConfig> = {
  streak: {
    icon: Flame,
    iconClass: "text-red-500 bg-red-50",
    valueClass: "text-red-500",
  },
  count: {
    icon: Calendar,
    iconClass: "text-blue-500 bg-blue-50",
    valueClass: "text-blue-500",
  },
  time: {
    icon: Clock,
    iconClass: "text-purple-500 bg-purple-50",
    valueClass: "text-purple-500",
  },
};

export const MEETING_HOURS_PER_SESSION = 1;
