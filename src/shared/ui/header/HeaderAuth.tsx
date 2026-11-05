"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/app/providers/AuthClientProvider";
import { buttonVariants } from "../button/Button";
import BellPlaceholder from "./BellPlaceholder";
import MobileMenu from "./MobileMenu";
import NotificationBell from "./NotificationBell";
import ProfileIcon from "./ProfileIcon";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderAuthProps {
  variant: "mobile-profile" | "desktop" | "mobile-menu";
  navItems?: NavItem[];
}

export default function HeaderAuth({
  variant,
  navItems = [],
}: HeaderAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // 모바일: 로그인 상태일 때만 왼쪽 프로필 표시
  if (variant === "mobile-profile") {
    // 조회 전: 표시용 쿠키 기준으로 CSS가 스켈레톤 노출 여부를 결정
    if (isLoading) {
      return (
        <div className="auth-in-only h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      );
    }
    if (!isAuthenticated) return null;

    return <ProfileIcon asLink />;
  }

  // 모바일 메뉴
  if (variant === "mobile-menu") {
    return (
      <MobileMenu
        navItems={navItems}
        isLogin={isAuthenticated}
        isLoading={isLoading}
      />
    );
  }

  // 데스크톱 인증 UI
  // 조회 전: 두 상태를 모두 렌더링하고 표시용 쿠키 기준으로 CSS가 하나만 노출
  if (isLoading) {
    return (
      <>
        <div className="auth-out-only contents">
          <GuestLinks />
        </div>
        <div className="auth-in-only contents">
          <SignedInPlaceholder />
        </div>
      </>
    );
  }

  if (!isAuthenticated) return <GuestLinks />;

  return (
    <>
      <NotificationBell />
      <ProfileIcon />
    </>
  );
}

// 로그인 사용자 조회 전 자리 표시: 벨은 아이콘 그대로, 프로필은 같은 크기의 원
function SignedInPlaceholder() {
  return (
    <>
      <BellPlaceholder />
      <span className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
    </>
  );
}

// 비로그인 상태의 회원가입·로그인 버튼
function GuestLinks() {
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
}
