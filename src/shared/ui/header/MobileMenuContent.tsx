"use client";

import { useFocusTrap } from "@/shared/lib/useFocusTrap";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "../button/Button";
import { NavItem } from "./types";
import { useLogout } from "./useLogout";

interface MobileMenuContentProps {
  navItems: NavItem[];
  isLogin: boolean;
  onClose: () => void;
}

export function MobileMenuContent({
  navItems,
  isLogin,
  onClose,
}: MobileMenuContentProps) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const pathname = usePathname();
  const logout = useLogout();

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
      className="fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl"
    >
      <div className="flex justify-end px-5 py-4">
        <button
          onClick={onClose}
          className="cursor-pointer p-1"
          aria-label="메뉴 닫기"
          autoFocus
        >
          <X size={18} />
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
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

      <div className="px-4 py-4">
        {isLogin ? (
          <button
            type="button"
            onClick={async () => { onClose(); await logout(); }}
            className="p-3 text-sm text-slate-400 underline hover:cursor-pointer hover:text-slate-600"
          >
            로그아웃
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className={twMerge(
                buttonVariants({ variant: "primary", size: "md" }),
                "w-full justify-center rounded-xl"
              )}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="text-center text-sm text-gray-500 hover:text-gray-700"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
