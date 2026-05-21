"use client";

import { useEffect, useRef, useState } from "react";

interface UsePickerProps<T> {
  initialValue?: T;
}

export const useDatePicker = <T>({ initialValue }: UsePickerProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<T | undefined>(initialValue);

  const ref = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setTempValue(initialValue);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempValue(undefined);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return {
    isOpen,
    ref,
    tempValue,
    setTempValue,
    openModal,
    closeModal,
    handleReset,
  };
};
