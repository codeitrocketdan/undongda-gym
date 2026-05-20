"use client";
import logo from "@/shared/assets/images/logo_dagym.png";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  //   const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath = "/gyms";
  const NAV_ITEMS = [
    { label: "다짐 보기", href: "/gym" },
    { label: "찜한 다짐", href: "/class" },
    { label: "모든 리뷰", href: "/review" },
    { label: "다짐 토크", href: "/talk" },
  ];
  return (
    <>
      <header className="flex items-center justify-between bg-white px-4 py-2">
        <div className="header-wrap flex items-center">
          <Link href="/" className="mr-4">
            <Image src={logo} alt="운동다짐 로고" width={100}></Image>
          </Link>
          <ul className="hidden gap-2 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`p-4 font-medium transition-colors ${
                      isActive ? "font-semibold text-blue-600" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="header-wrap">
          <div className="pc-menu hidden items-center gap-3 md:flex">
            <Bell />
            <Link href="/mypage" className="rounded-full bg-gray-900 p-2">
              <UserRound size={26} color="#fff" />
            </Link>
          </div>
          <Menu className="cursor-pointer md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </header>

      {/* 모바일 햄버거 메뉴 + 모션 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }} // 시작 위치 (오른쪽 바깥)
            animate={{ x: 0 }} // 나타날 위치
            exit={{ x: "100%" }} // 사라질 위치
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-[280px] bg-white p-6 shadow-xl md:hidden"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="cursor-pointer">
                <X />
              </button>
            </div>
            <ul className="mt-8 space-y-6 text-lg font-bold">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`p-4 font-medium transition-colors ${
                        isActive
                          ? "font-semibold text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
