import logo from "@/shared/assets/images/logo.png";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "../button/Button";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import NotificationBell from "./NotificationBell";
import ProfileIcon from "./ProfileIcon";

const NAV_ITEMS = [
  { label: "다짐 보기", href: "/dagym" },
  { label: "찜한 다짐", href: "/favorite" },
  { label: "모든 리뷰", href: "/review" },
  { label: "다짐 토크", href: "/post" },
];

export default async function Header() {
  const cookieStore = await cookies();
  const isLogin = !!cookieStore.get("accessToken")?.value;

  return (
    <header>
      <div className="relative mx-auto mb-4 flex w-full max-w-7xl items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {isLogin && (
            <div className="md:hidden">
              <ProfileIcon asLink />
            </div>
          )}
          <Link href="/" className="hidden md:block">
            <Image src={logo} alt="운동다짐 로고" width={100} priority />
          </Link>
          <NavLinks navItems={NAV_ITEMS} />
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Image src={logo} alt="운동다짐 로고" width={100} priority />
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 md:flex">
            <DesktopAuthSection isLogin={isLogin} />
          </div>
          <MobileMenu navItems={NAV_ITEMS} isLogin={isLogin} />
        </div>
      </div>
    </header>
  );
}

function DesktopAuthSection({ isLogin }: { isLogin: boolean }) {
  if (!isLogin)
    return (
      <>
        <Link
          href="/signup"
          className="text-sm font-medium whitespace-nowrap text-gray-600 hover:text-gray-900"
        >
          회원가입
        </Link>
        <Link
          href="/login"
          className={twMerge(
            buttonVariants({ variant: "primary", size: "md" }),
            "rounded-xl px-5"
          )}
        >
          로그인
        </Link>
      </>
    );

  return (
    <>
      <NotificationBell />
      <ProfileIcon />
    </>
  );
}
