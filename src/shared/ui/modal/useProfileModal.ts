"use client";

import { useState } from "react";
import { useModal } from "./useModal";

export function useProfileModal() {
  const modal = useModal();
  const [userId, setUserId] = useState<number | null>(null);

  const open = (id: number) => {
    setUserId(id);
    modal.open();
  };

  return {
    isOpen: modal.isOpen && userId !== null,
    userId,
    open,
    close: modal.close,
  };
}
