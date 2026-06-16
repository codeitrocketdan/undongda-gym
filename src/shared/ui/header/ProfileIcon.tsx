"use client";
import { useUserProfile } from "@/features/my-page/model/useUserProfile";
import avatar from "@/shared/assets/images/avatar.svg";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function ProfileIcon({ className }: { className?: string }) {
  const { data: profile } = useUserProfile();

  return (
    <Link
      href="/mypage"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
      aria-label="마이페이지"
    >
      {profile?.image ? (
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
      )}
    </Link>
  );
}
