"use client";
import { useUserProfile } from "@/features/my-page/model/useUserProfile";
import avatar from "@/shared/assets/images/avatar.svg";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { Pencil } from "lucide-react";
import Image from "next/image";

export default function ProfileSection() {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading || !profile) {
    return (
      <div className="gradient-blue-light relative flex flex-row gap-6 rounded-2xl border border-blue-300 p-4 md:rounded-3xl md:p-6 lg:flex-col lg:items-center lg:justify-center lg:gap-4 lg:px-10 lg:py-8">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full md:h-28 md:w-28" />
        <div className="flex flex-col justify-center gap-2 lg:items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-7 w-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-blue-light relative flex flex-row gap-6 rounded-2xl border border-blue-300 p-4 md:rounded-3xl md:p-6 lg:flex-col lg:items-center lg:justify-center lg:gap-4 lg:px-10 lg:py-8">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white md:h-28 md:w-28">
        {profile.image ? (
          <Image
            src={profile.image}
            alt={profile.name}
            fill
            className="rounded-full"
          />
        ) : (
          <Image src={avatar} alt="기본 이미지" fill className="rounded-full" />
        )}
      </div>
      <div className="flex flex-col justify-center lg:items-center">
        <div className="px-3 py-1.5">
          <span className="md:text-lg-semibold text-base-semibold">
            {profile.name}
          </span>
          <button
            type="button"
            onClick={() => {}}
            className="ml-1.5 text-slate-400 hover:cursor-pointer hover:text-slate-600"
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        <div className="rounded-2xl bg-blue-200 px-3 py-1.5">
          <span className="lg:text-sm-medium text-slate-600">
            {profile.email}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="absolute right-4 bottom-4 text-sm text-slate-400 underline hover:cursor-pointer hover:text-slate-600 lg:bottom-1"
      >
        로그아웃
      </button>
    </div>
  );
}
