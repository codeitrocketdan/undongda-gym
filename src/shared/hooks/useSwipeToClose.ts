"use client";

import { useRef, useState } from "react";

export function useSwipeToClose(onClose: () => void) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setDragY(delta);
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  const handleTouchCancel = () => {
    setDragY(0);
  };

  return { dragY, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel };
}
