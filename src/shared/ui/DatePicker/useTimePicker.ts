"use client";

import { useMemo, useState } from "react";

interface Props {
  initialValue?: string;
}

export const useTimePicker = ({ initialValue }: Props) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(() => {
    if (!initialValue) return null;

    return Number(initialValue.split(":")[0]);
  });

  const [selectedMinute, setSelectedMinute] = useState<number | null>(() => {
    if (!initialValue) return null;

    return Number(initialValue.split(":")[1]);
  });

  const formattedTime = useMemo(() => {
    if (selectedHour === null || selectedMinute === null) return "";

    return `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;
  }, [selectedHour, selectedMinute]);

  return {
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    formattedTime,
  };
};
