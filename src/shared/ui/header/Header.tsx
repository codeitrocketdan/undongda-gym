import Image from "next/image";
import Link from "next/link";
import logo from "@/shared/assets/images/logo.png";
import HeaderAuth from "./HeaderAuth";
import NavLinks from "./NavLinks";

const NAV_ITEMS = [
  { label: "다짐 보기", href: "/dagym" },
  { label: "찜한 다짐", href: "/favorite" },
  { label: "모든 리뷰", href: "/review" },
  { label: "다짐 토크", href: "/post" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[var(--color-background)]">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {/* 모바일 로그인 상태일 때 왼쪽 프로필 */}
          <div className="md:hidden">
            <HeaderAuth variant="mobile-profile" />
          </div>

          <Link href="/" className="hidden md:block">
            <Image
              src={logo}
              alt="운동다짐 로고"
              width={100}
              preload
              fetchPriority="high"
            />
          </Link>

          <NavLinks navItems={NAV_ITEMS} />
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Image
            src={logo}
            alt="운동다짐 로고"
            width={100}
            preload
            fetchPriority="high"
          />
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 md:flex">
            <HeaderAuth variant="desktop" />
          </div>

          <HeaderAuth variant="mobile-menu" navItems={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
