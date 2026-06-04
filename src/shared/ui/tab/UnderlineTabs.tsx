"use client";
import { useTabs } from "@/shared/hooks/useTabs";
import { twMerge } from "tailwind-merge";
import { Tab } from "./types";

interface UnderlineTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function UnderlineTabs({ tabs, defaultValue = "", onChange }: UnderlineTabsProps) {
  const { isActive, handleChange } = useTabs<string>({
    defaultValue,
    onChange,
  });

  return (
    <div className="flex w-full border-b-2 border-slate-200 md:w-auto">
      {tabs.map((type) => (
        <button
          key={type.id}
          type="button"
          className={twMerge(
            "text-sm-semibold -mb-0.5 cursor-pointer border-b-2 px-8 py-2 whitespace-nowrap",
            isActive(type.name)
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-600 hover:border-slate-300"
          )}
          onClick={() => handleChange(type.name)}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
}
