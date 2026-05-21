"use client";

import { useDropdownContext } from "./Dropdown";

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DropdownItem({ children, onClick }: DropdownItemProps) {
  const { close } = useDropdownContext();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <li className="rounded-lg hover:bg-blue-200 hover:text-blue-600">
      <button
        type="button"
        className="w-full cursor-pointer px-3 py-1.5 text-left"
        onClick={handleClick}
      >
        {children}
      </button>
    </li>
  );
}
