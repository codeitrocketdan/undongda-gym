"use client";

import Link from "next/link";
import { useAdminDashboardViewModel } from "../model/useAdminDashboardViewModel";

export default function QuickStartBoard() {
  const { quickStartItems } = useAdminDashboardViewModel();

  return (
    <section>
      <h2 className="mb-6 text-lg font-semibold text-gray-800">빠른 시작</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {quickStartItems.map(({ step, description, buttonLabel, href }) => (
          <div
            key={step}
            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
              {step}
            </span>
            <p className="flex-1 text-sm font-medium text-gray-700">
              {description}
            </p>
            <Link
              href={href}
              className="mt-auto w-full rounded-xl border border-blue-500 px-4 py-2 text-center text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-50"
            >
              {buttonLabel}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
