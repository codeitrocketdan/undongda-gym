"use client";
import avatar from "@/shared/assets/images/avatar.svg";
import { useUser } from "@/shared/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import ProfileMenu from "./ProfileMenu";
import { useLogout } from "./useLogout";

interface Props {
  className?: string;
  asLink?: boolean;
}

export default function ProfileIcon({ className, asLink }: Props) {
  const { user: profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const imageContent = profile?.image ? (
    <Image
      src={profile.image}
      alt={profile.name}
      width={40}
      height={40}
      className="rounded-full"
    />
  ) : (
    <Image
      src={avatar}
      alt="기본 이미지"
      className={twMerge("rounded-full", className)}
    />
  );

  if (asLink) {
    return (
      <Link
        href="/mypage"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
        aria-label="마이페이지"
      >
        {imageContent}
      </Link>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
        aria-label="프로필 메뉴"
      >
        {imageContent}
      </button>

      {isOpen && <ProfileMenu onLogout={handleLogout} setIsOpen={setIsOpen} />}
    </div>
  );
}
