"use client";
import { useTabs } from "@/shared/hooks/useTabs";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { Tab } from "./types";

interface UnderlineTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function UnderlineTabs({
  tabs,
  defaultValue = "",
  onChange,
}: UnderlineTabsProps) {
  const { activeTab, isActive, handleChange } = useTabs<string>({
    defaultValue,
    onChange,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  const update = useCallback(() => {
    const idx = tabs.findIndex((t) => t.name === activeTab);
    const btn = btnRefs.current[idx];
    if (btn) {
      setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
      setReady(true);
    }
  }, [activeTab, tabs]);

  // 탭 클릭 시 — 레이아웃 확정 후 동기적으로 측정
  useLayoutEffect(() => {
    update();
  }, [update]);

  // 창 크기 변경 시 재측정
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => update());
    observer.observe(container);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full border-b-2 border-slate-200 md:w-auto"
    >
      {tabs.map((type, i) => (
        <button
          key={type.id}
          ref={(el) => {
            btnRefs.current[i] = el;
          }}
          type="button"
          className={twMerge(
            "text-sm-semibold flex-1 cursor-pointer px-8 py-2 whitespace-nowrap transition-colors duration-200 md:flex-none",
            isActive(type.name)
              ? "text-blue-600"
              : "text-slate-600 hover:text-slate-800"
          )}
          onClick={() => handleChange(type.name)}
        >
          {type.name}
        </button>
      ))}
      {/* 레퍼런스와 동일: 단일 div가 transform으로 슬라이드 (GPU 합성) */}
      {ready && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-[transform,width] duration-300 ease-out"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />
      )}
    </div>
  );
}
