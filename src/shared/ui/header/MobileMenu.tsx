"use client";

import useScrollLock from "@/shared/hooks/useScrollLock";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavItem } from "./types";

interface MobileMenuProps {
  navItems: NavItem[];
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  useScrollLock(isMenuOpen);

  return (
    <div className="md:hidden">
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="cursor-pointer p-1"
        aria-label="메뉴 열기"
      >
        <Menu />
      </button>

      {/* 모바일 사이드바 모션 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 배경 어두워지는 딤드(Overlay) 처리 추가하면 더 자연스러워요 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            <motion.div
              initial={{ x: "100%" }} // 시작 위치 (오른쪽 바깥)
              animate={{ x: 0 }} // 나타날 위치
              exit={{ x: "100%" }} // 사라질 위치
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-[280px] overflow-y-auto bg-white p-6 shadow-xl"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="cursor-pointer p-1"
                  aria-label="메뉴 닫기"
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
                        onClick={() => setIsMenuOpen(false)} // 링크 클릭 시 메뉴 닫기
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
