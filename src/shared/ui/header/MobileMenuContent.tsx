"use client";

import { useFocusTrap } from "@/shared/lib/useFocusTrap"; // 훅 경로 확인
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { NavItem } from "./types";

interface MobileMenuContentProps {
  navItems: NavItem[];
  pathname: string | null;
  onClose: () => void;
}

export function MobileMenuContent({ navItems, pathname, onClose }: MobileMenuContentProps) {
  // 컴포넌트가 마운트될 때 훅이 실행되므로 ref가 정확히 주입됩니다.
  const trapRef = useFocusTrap<HTMLDivElement>();

  return (
    <motion.div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label="모바일 메뉴"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 z-50 h-full w-[280px] overflow-y-auto bg-white p-6 shadow-xl"
    >
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="cursor-pointer p-1"
          aria-label="메뉴 닫기"
          autoFocus // 열리자마자 초점 잡기
        >
          <X />
        </button>
      </div>

      <ul className="mt-8 space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`block rounded-lg p-3 text-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
