"use client";

import { useTabs } from "@/shared/hooks/useTabs";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Tab } from "./types";

interface PillTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function PillTabs({
  tabs,
  defaultValue = "",
  onChange,
}: PillTabsProps) {
  const { isActive, handleChange } = useTabs<string>({
    defaultValue,
    onChange,
  });

  return (
    <div className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.12 }}
          className={twMerge(
            "text-base-medium rounded-2xl px-4 py-2 hover:cursor-pointer",
            isActive(tab.name)
              ? "bg-slate-700 text-white"
              : "bg-slate-200 text-slate-800 hover:bg-slate-300"
          )}
          onClick={() => handleChange(tab.name)}
        >
          {tab.name}
        </motion.button>
      ))}
    </div>
  );
}
