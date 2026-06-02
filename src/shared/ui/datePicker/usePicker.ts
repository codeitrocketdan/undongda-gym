"use client";

import { useEffect, useRef, useState } from "react";

interface UsePickerProps<T> {
  initialValue?: T;
}

export const useDatePicker = <T>({ initialValue }: UsePickerProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<T | undefined>(initialValue);

  const ref = useRef<HTMLDivElement>(null); // DatePicker
  const triggerRef = useRef<HTMLDivElement>(null); // 인풋창(트리거)용 Ref
  const [coords, setCoords] = useState({ top: 0, left: 0 }); // 팝오버가 떠야 할 좌표

  // CreatePortal 위치 계산 함수
  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        // 인풋창 바로 아래에 배치
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const openModal = () => {
    setTempValue(initialValue);
    setIsOpen(true);
    // 모달 열 때 위치 계산 리프레시
    setTimeout(updateCoords, 0);
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

    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [isOpen]);

  return {
    isOpen,
    ref,
    triggerRef,
    coords,
    tempValue,
    setTempValue,
    openModal,
    closeModal,
    handleReset,
  };
};
