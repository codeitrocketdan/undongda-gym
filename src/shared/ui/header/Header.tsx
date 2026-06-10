"use client";
import { useAuth } from "@/app/providers/AuthClientProvider";
import logo from "@/shared/assets/images/logo_dagym.png";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../button/Button";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import ProfileDropdown from "./ProfileDropdown";
import ProfileIcon from "./ProfileIcon";

export default function Header() {
  const NAV_ITEMS = [
    { label: "다짐 보기", href: "/dagym" },
    { label: "찜한 다짐", href: "/favorite" },
    { label: "모든 리뷰", href: "/review" },
    { label: "다짐 토크", href: "/talk" },
  ];

  const { isAuthenticated } = useAuth();
  return (
    <>
      <header className="relative md:mb-7">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-6">
          <div className="header-wrap md:hidden">
            {isAuthenticated && <ProfileIcon />}
          </div>
          <div className="header-wrap flex items-center">
            <Link
              href="/"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:top-0 md:left-0 md:mr-4 md:translate-x-0 md:translate-y-0"
            >
              <Image
                src={logo}
                alt="운동다짐 로고"
                width={100}
                className="w-25"
                priority
              ></Image>
            </Link>
            <NavLinks navItems={NAV_ITEMS} />
          </div>
          <div className="header-wrap">
            <div className="pc-menu hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <>
                  <Bell />
                  {/* <ProfileIcon /> */}
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="whitespace-nowrap text-gray-700"
                  >
                    회원가입
                  </Link>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => console.log("test")}
                    className="flex gap-1.5 rounded-xl px-6 py-3"
                  >
                    <Link href="/login">로그인</Link>
                  </Button>
                </>
              )}
            </div>

            <MobileMenu navItems={NAV_ITEMS} />
          </div>
        </div>
      </header>

      {/* 모바일 햄버거 메뉴 + 모션 */}
    </>
  );
}
