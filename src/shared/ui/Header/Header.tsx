"use client";
import logo from "@/shared/assets/images/logo_dagym.png";
import { Bell, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

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
      <header className="mb-7 flex items-center justify-between bg-white px-4 py-6">
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
          {/* <Menu className="cursor-pointer md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} /> */}
          <MobileMenu navItems={NAV_ITEMS} currentPath={currentPath} />
        </div>
      </header>

      {/* 모바일 햄버거 메뉴 + 모션 */}
    </>
  );
}
