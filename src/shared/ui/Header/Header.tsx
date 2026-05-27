import logo from "@/shared/assets/images/logo_dagym.png";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../button/Button";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import ProfileIcon from "./ProfileIcon";

export default function Header() {
  const NAV_ITEMS = [
    { label: "다짐 보기", href: "/gym" },
    { label: "찜한 다짐", href: "/class" },
    { label: "모든 리뷰", href: "/review" },
    { label: "다짐 토크", href: "/talk" },
  ];

  const isLogin = true;
  return (
    <>
      <header className="relative flex items-center justify-between bg-white p-6 md:mb-7">
        <div className="header-wrap md:hidden">{isLogin && <ProfileIcon />}</div>
        <div className="header-wrap flex items-center">
          <Link
            href="/"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:top-0 md:left-0 md:mr-4 md:translate-x-0 md:translate-y-0"
          >
            <Image src={logo} alt="운동다짐 로고" width={100} className="w-25"></Image>
          </Link>
          <NavLinks navItems={NAV_ITEMS} />
        </div>
        <div className="header-wrap">
          <div className="pc-menu hidden items-center gap-3 md:flex">
            {isLogin ? (
              <>
                <Bell />
                <ProfileIcon />
              </>
            ) : (
              <>
                <Link href="/signup" className="text-gray-700">
                  회원가입
                </Link>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => console.log("test")}
                  className="flex gap-1.5 rounded-xl px-6 py-3"
                >
                  로그인
                </Button>
              </>
            )}
          </div>

          <MobileMenu navItems={NAV_ITEMS} />
        </div>
      </header>

      {/* 모바일 햄버거 메뉴 + 모션 */}
    </>
  );
}
