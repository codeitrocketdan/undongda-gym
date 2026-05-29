"use client";

import useScrollLock from "@/shared/hooks/useScrollLock";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileMenuContent } from "./MobileMenuContent";
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

            <MobileMenuContent
              navItems={navItems}
              pathname={pathname}
              onClose={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
