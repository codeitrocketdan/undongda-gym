"use client";

import { Ellipsis } from "lucide-react";
import { useState } from "react";

import { useOutsideClick } from "@/shared/hooks/useOutsizeClick";
import ActionMenu from "./ActionMenu";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DagymHostMenu({ onEdit, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <Ellipsis color="#62748e" className="cursor-pointer" />
      </button>

      {isOpen && (
        <ActionMenu
          onEdit={() => {
            setIsOpen(false);
            onEdit();
          }}
          onDelete={() => {
            setIsOpen(false);
            onDelete();
          }}
        />
      )}
    </div>
  );
}
