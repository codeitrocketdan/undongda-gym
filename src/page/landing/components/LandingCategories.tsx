"use client";

import { REGULAR_CLASS_TYPES } from "@/features/dagym/constants/meetingTypes";
import { MeetingTypeDTO } from "@/features/dagym/types";
import { useInView } from "@/shared/hooks/useInView";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_COLORS = [
  "bg-green-100",
  "bg-blue-100",
  "gradient-blue-light",
  "gradient-blue-light",
  "bg-blue-100",
  "bg-green-100",
];

function getCategoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

function parseImageUrl(description: string | null): string | null {
  if (!description) return null;
  try {
    const parsed = JSON.parse(description);
    return parsed.imageUrl || null;
  } catch {
    return null;
  }
}

export default function LandingCategories() {
  const { ref, isInView } = useInView();
  const { data: categories = [] } = useQuery<MeetingTypeDTO[]>({
    queryKey: ["meeting-types"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting-types`
      );
      return res.json();
    },
  });

  const featuredCategories = categories
    .filter((c) => REGULAR_CLASS_TYPES.includes(c.name))
    .slice(0, 6);

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-26">
      <div className="mb-13 text-center">
        <span className="text-sm-bold mb-3 inline-block text-blue-600">
          다짐 둘러보기
        </span>
        <h2 className="text-2xl-bold md:text-3xl-bold mb-3 text-gray-900">
          다양한 운동 다짐을 만나보세요
        </h2>
        <p className="text-base-regular md:text-lg-regular text-gray-600">
          관심사에 맞는 운동을 골라 함께할 사람들을 만나보세요.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {featuredCategories.map((category, index) => {
          const bgColor = getCategoryColor(index);
          return (
            <Link
              key={category.id}
              href={`/dagym?type=${encodeURIComponent(category.name)}`}
              style={{
                animation: isInView
                  ? `fadeInUp 1s ease-out ${index * 0.1}s forwards`
                  : "none",
              }}
              className={`flex h-36 w-36 flex-col items-center justify-center gap-4 rounded-3xl px-1 py-1 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${bgColor} ${
                !isInView ? "opacity-0" : ""
              }`}
            >
              <div className="flex h-20 w-30 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-md">
                {(() => {
                  const imageUrl = parseImageUrl(category.description);
                  return imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      width={120}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  ) : null;
                })()}
              </div>
              <span className="text-sm-bold text-center text-gray-900">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
