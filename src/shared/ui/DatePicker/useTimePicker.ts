"use client";

import { useMemo, useState } from "react";

interface Props {
  initialValue?: string;
}

export const useTimePicker = ({ initialValue }: Props) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);

  const applyTime = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  const resetTime = () => {
    setSelectedHour(null);
    setSelectedMinute(null);
  };

  const formattedTime = useMemo(() => {
    if (selectedHour === null || selectedMinute === null) return "";
    return `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;
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
