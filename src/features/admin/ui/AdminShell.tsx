"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  // 작은 화면에서는 기본적으로 접힌(아이콘 레일) 상태로 시작
  // 브라우저 window API에 의존하는 초기값이라 렌더 중 순수 계산으로 대체할 수 없음
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const syncWithViewport = (e: MediaQueryList | MediaQueryListEvent) => {
      setIsOpen(!e.matches);
    };
    syncWithViewport(mql);
    mql.addEventListener("change", syncWithViewport);
    return () => mql.removeEventListener("change", syncWithViewport);
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />

      <main
        className={`flex-1 p-8 transition-[margin-left] duration-300 ${
          isOpen ? "ml-60" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
