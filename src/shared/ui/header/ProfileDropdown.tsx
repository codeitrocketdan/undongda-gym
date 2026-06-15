"use client";
import { useEffect, useRef, useState } from "react";

import { UserRound } from "lucide-react";
// import LogoutModal from "../modal/LogoutModal";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  //   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsOpen(false);
    // setIsLogoutModalOpen(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
      }
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], null);
      //   onClose();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
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
      {/* {isLogoutModalOpen && (
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      )} */}
    </div>
  );
}
