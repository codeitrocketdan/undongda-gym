"use client";

import { useTabs } from "@/shared/hooks/useTabs";
import { twMerge } from "tailwind-merge";
import { Tab } from "./types";

interface PillTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function PillTabs({ tabs, defaultValue = "", onChange }: PillTabsProps) {
  const { isActive, handleChange } = useTabs<string>({
    defaultValue,
    onChange,
  });

  return (
    <div className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={twMerge(
            "text-base-medium rounded-2xl px-4 py-2 hover:cursor-pointer",
            isActive(tab.name)
              ? "bg-slate-700 text-white"
              : "bg-slate-200 text-slate-800 hover:bg-slate-300"
          )}
          onClick={() => handleChange(tab.name)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
