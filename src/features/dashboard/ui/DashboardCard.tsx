import { cva } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { LucideIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { CARD_CONFIGS, type CardType } from "../constants";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const cardVariants = cva(
  "flex flex-col xs:flex-row items-center md:p-4 md:gap-4 bg-white rounded-2xl shadow-xs w-full p-2 gap-2"
);

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
      <div className={cn("rounded-xl p-2", config.iconClass)}>
        <IconComponent className="h-6 w-6" />
      </div>

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
