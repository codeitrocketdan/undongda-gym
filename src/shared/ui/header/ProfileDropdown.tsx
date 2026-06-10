"use client";
import { useEffect, useRef, useState } from "react";

import { UserRound } from "lucide-react";
import LogoutModal from "../Modal/LogoutModal";
import ProfileMenu from "./ProfileMenu";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <UserRound size={26} color="#fff" />
      </button>

      {isOpen && <ProfileMenu onLogout={handleLogout} setIsOpen={setIsOpen} />}
      {isLogoutModalOpen && (
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      )}
    </div>
  );
}
