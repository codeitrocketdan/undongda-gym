"use client";

import { useInView } from "@/shared/hooks/useInView";
import { buttonVariants } from "@/shared/ui/button/Button";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function LandingCta() {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`mx-auto max-w-3xl px-6 py-27 text-center md:py-33 ${
        isInView ? "animate-fadeInUp" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl-bold md:text-display-md-bold mb-8 text-gray-900">
        혼자 다짐하기 어려웠던 운동,
        <br />
        운동다짐에서 함께 해요
      </h2>
      <Link
        href="/dagym"
        className={twMerge(
          buttonVariants({ variant: "primary", size: "md" }),
          "w-fit hover:bg-blue-700 mx-auto"
        )}
      >
        지금 다짐하기
      </Link>
    </div>
  );
}
