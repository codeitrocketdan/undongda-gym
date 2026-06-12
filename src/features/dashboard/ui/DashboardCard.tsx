import { cva } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { Calendar, Clock, Flame, LucideIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const cardVariants = cva(
  "flex flex-col xs:flex-row items-center justi md:p-4 md:gap-4 bg-white rounded-2xl shadow-xs w-full p-2 gap-2"
);

type CardType = "streak" | "count" | "time";

interface CardStyleConfig {
  icon: LucideIcon;
  iconClass: string;
  valueClass: string;
}

const CARD_CONFIGS: Record<CardType, CardStyleConfig> = {
  streak: {
    icon: Flame,
    iconClass: "text-red-500 bg-red-50",
    valueClass: "text-[#FF669C]",
  },
  count: {
    icon: Calendar,
    iconClass: "text-blue-500 bg-blue-50",
    valueClass: "text-cyan-400",
  },
  time: {
    icon: Clock,
    iconClass: "text-purple-500 bg-purple-50",
    valueClass: "text-[#8481FF]",
  },
};

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CardType;
  title: string;
  value: string | number;
  unit: string;
  customIcon?: LucideIcon;
}

export function DashboardCard({
  title,
  value,
  unit,
  type = "streak",
  customIcon,
  className,
  ...props
}: DashboardCardProps) {
  const config = CARD_CONFIGS[type];
  const IconComponent = customIcon || config.icon;

  return (
    <div className={cn(cardVariants(), className)} {...props}>
      {/* 아이콘 컨테이너 */}
      <div className={cn("rounded-xl p-2", config.iconClass)}>
        <IconComponent className="h-6 w-6" />
      </div>

      {/* 텍스트 컨테이너 */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-3xl font-bold tracking-tight",
              config.valueClass
            )}
          >
            {value}
          </span>
          <span className="text-sm font-medium text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );
}
