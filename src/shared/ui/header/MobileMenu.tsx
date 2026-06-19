"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { MobileMenuContent } from "./MobileMenuContent";
import NotificationBell from "./NotificationBell";
import { NavItem } from "./types";
import { useMobileMenu } from "./useMobileMenu";

interface MobileMenuProps {
  navItems: NavItem[];
  isLogin: boolean;
}

export default function MobileMenu({ navItems, isLogin }: MobileMenuProps) {
  const { isOpen, open, close } = useMobileMenu();

  return (
    <div className="flex items-center md:hidden">
      {isLogin && <NotificationBell />}
      <button
        onClick={open}
        className="cursor-pointer p-1"
        aria-label="메뉴 열기"
      >
        <Menu size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black"
            />
            <MobileMenuContent
              navItems={navItems}
              isLogin={isLogin}
              onClose={close}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
