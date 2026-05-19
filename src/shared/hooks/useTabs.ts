"use client";

import { useState } from "react";

interface UseTabsOptions<T extends string> {
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useTabs<T extends string>({ defaultValue, onChange }: UseTabsOptions<T>) {
  const [activeTab, setActiveTab] = useState<T>(defaultValue);
  const handleChange = (value: T) => {
    setActiveTab(value);
    onChange?.(value);
  };

  const isActive = (value: T) => activeTab === value;
  return { activeTab, handleChange, isActive };
}
