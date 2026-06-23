"use client";

import bgCharacter from "@/shared/assets/images/bg_character.png";
import Button from "@/shared/ui/button/Button";
import { useInView } from "@/shared/hooks/useInView";
import {
  Calendar,
  CalendarCheck,
  Check,
  Clock,
  Flame,
  Heart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const DATES = [
  { day: 14, done: false, reserved: false },
  { day: 15, done: true, reserved: false },
  { day: 16, done: true, reserved: false },
  { day: 17, done: false, reserved: true },
  { day: 18, done: true, reserved: false },
  { day: 19, done: false, reserved: false },
  { day: 20, done: false, reserved: false },
];

const STATS = [
  {
    icon: Flame,
    label: "연속 다짐",
    value: 3,
    unit: "일째",
    iconClass: "text-red-500 bg-red-50",
    valueClass: "text-red-500",
  },
  {
    icon: Calendar,
    label: "다짐 횟수",
    value: 12,
    unit: "회",
    iconClass: "text-blue-500 bg-blue-50",
    valueClass: "text-blue-500",
  },
  {
    icon: Clock,
    label: "다짐 시간",
    value: 8,
    unit: "시간",
    iconClass: "text-purple-500 bg-purple-50",
    valueClass: "text-purple-500",
  },
];

function PhoneMock() {
  return (
    <div className="absolute top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-gray-100 bg-white p-2.5 shadow-2xl">
      <div className="flex flex-col gap-4 overflow-hidden rounded-[30px] bg-gray-50 px-4 pt-5 pb-4">
        <div
          style={{ backgroundImage: `url(${bgCharacter.src})` }}
          className="w-full rounded-xl bg-white bg-size-[50px_50px] bg-bottom-right bg-no-repeat p-3.5 pr-12 shadow"
        >
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-xs-bold text-gray-800">예약된 다짐</span>
            <span className="text-xs-medium rounded-lg bg-slate-200 px-1.5 py-0.5 text-slate-800">
              웨이트
            </span>
          </div>
          <p className="text-sm-bold text-gray-900">서울 성동구점</p>
          <p className="text-xs-medium text-gray-600">
            14:00~14:50 · 2026-08-02(일)
          </p>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-sm-bold text-gray-800">6월 다짐 기록</span>
            <CalendarCheck size={18} className="text-gray-700" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-xs-medium text-gray-400">
                {d}
              </span>
            ))}
            {DATES.map((date) => (
              <div
                key={date.day}
                className="relative flex justify-center pt-1.5"
              >
                {date.reserved && (
                  <span className="absolute top-0 h-1 w-1 rounded-full bg-blue-700" />
                )}
                <span
                  className={twMerge(
                    "text-xs-medium flex h-6 w-6 items-center justify-center rounded-full text-gray-600",
                    date.done && "bg-blue-500 font-bold text-white"
                  )}
                >
                  {date.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-white p-2.5 shadow-sm"
            >
              <span
                className={twMerge(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  stat.iconClass
                )}
              >
                <stat.icon size={14} />
              </span>
              <span className="text-xs-medium text-gray-700">{stat.label}</span>
              <p className="flex items-baseline gap-0.5">
                <span className={twMerge("text-base-bold", stat.valueClass)}>
                  {stat.value}
                </span>
                <span className="text-xs-regular text-gray-500">
                  {stat.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingHero() {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-16 md:gap-12 md:flex-row md:py-24 ${
        isInView ? "animate-fadeInUp" : "opacity-0"
      }`}
    >
      <div className="w-full md:flex-1">
        <span className="text-sm-semibold mb-5 inline-block rounded-full bg-blue-200 px-3.5 py-1.5 text-blue-700">
          혼자가 아닌, 함께하는 운동 습관
        </span>
        <h1 className="text-3xl-bold md:text-display-md-bold mb-5 text-gray-900">
          혼자보다 함께,
          <br />
          운동다짐에서 시작해보세요
        </h1>
        <p className="text-base-regular md:text-lg-regular mb-8 max-w-md text-gray-600">
          작심삼일로 끝나던 운동, 이제 혼자가 아니에요.
          <br />
          온오프라인을 통해 만나서 같이 운동해요.
        </p>
        <div className="flex items-center gap-3.5">
          <Link href="/dagym">
            <Button variant="primary" size="md">
              다짐 보기
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative h-96 w-full md:h-110 md:flex-1">
        <div className="absolute inset-0 md:overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-90 w-90 -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-linear-to-br from-blue-200 to-green-100 opacity-80" />
        </div>
        <PhoneMock />
        <div
          className="absolute top-[14%] left-[2%] flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-lg"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-blue-100">
            <Heart size={14} className="fill-blue-500 stroke-none" />
          </span>
          <div>
            <p className="text-xs-bold text-gray-900">응원 24</p>
            <p className="text-xs-regular text-gray-500">방금 전</p>
          </div>
        </div>
        <div
          className="absolute top-[6%] right-[2%] flex items-center gap-2 rounded-2xl bg-linear-to-br from-green-500 to-green-600 px-3.5 py-2.5 text-white shadow-lg"
          style={{ animation: "float 3s ease-in-out 0.2s infinite" }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
            <Check size={13} />
          </span>
          <span className="text-xs-bold">오늘 인증 완료</span>
        </div>
        <div
          className="absolute right-[4%] bottom-[10%] flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-lg"
          style={{ animation: "float 3s ease-in-out 0.4s infinite" }}
        >
          <Users size={16} className="text-blue-600" />
          <span className="text-xs-bold text-gray-900">128명 운동 중</span>
        </div>
      </div>
    </div>
  );
}
