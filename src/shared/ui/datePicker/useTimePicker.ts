"use client";

import { useCallback, useMemo, useState } from "react";
import { formatTime } from "./utils";

export const useTimePicker = () => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);

  const applyTime = useCallback((hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, []);

  const resetTime = useCallback(() => {
    setSelectedHour(null);
    setSelectedMinute(null);
  }, []);

  const formattedTime = useMemo(() => {
    return selectedHour !== null && selectedMinute !== null
      ? formatTime(selectedHour, selectedMinute)
      : "";
  }, [selectedHour, selectedMinute]);

  return {
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    applyTime,
    resetTime,
    formattedTime,
  };
};
