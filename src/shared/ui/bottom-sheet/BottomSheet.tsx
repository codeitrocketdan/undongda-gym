"use client";

import { useSwipeToClose } from "@/shared/hooks/useSwipeToClose";

interface BottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ onClose, children }: BottomSheetProps) {
  const { dragY, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSwipeToClose(onClose);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? "transform 0.3s ease-out" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white px-5 pt-3 pb-8 shadow-xl"
      >
        <div className="mb-3 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        {children}
      </div>
    </>
  );
}
