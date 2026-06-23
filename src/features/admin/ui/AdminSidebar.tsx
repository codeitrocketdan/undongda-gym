"use client";

import { useUserProfile } from "@/features/my-page/model/useUserProfile";
import avatar from "@/shared/assets/images/avatar.svg";
import logo from "@/shared/assets/images/logo.png";
import logoV from "@/shared/assets/images/logo_v.png";
import { useLogout } from "@/shared/ui/header/useLogout";
import {
  LayoutDashboard,
  List,
  ListPlus,
  LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Tags,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "대시보드", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "다짐 타입 관리", href: "/admin/types", icon: Tags },
  { label: "다짐 만들기", href: "/admin/create", icon: ListPlus },
  { label: "다짐 리스트", href: "/admin/dagyms", icon: List },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: user } = useUserProfile();
  const logout = useLogout();
  const isLoggedIn = !!user?.id;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r bg-white transition-[width] duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b ${isOpen ? "justify-between px-4" : "justify-center px-2"}`}
      >
        {isOpen ? (
          <>
            <Image src={logo} alt="운동다짐" className="w-25 object-cover" />
            <button
              type="button"
              onClick={onToggle}
              aria-label="사이드바 닫기"
              className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-label="사이드바 열기"
            className="group relative flex h-9 w-9 cursor-pointer items-center justify-center"
          >
            <Image
              src={logoV}
              alt="운동다짐"
              className="w-full object-cover transition-opacity group-hover:opacity-0"
            />
            <PanelLeftOpen
              size={18}
              className="absolute text-gray-700 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>
        )}
      </div>

      {/* 유저 정보 + 로그아웃 */}
      <div
        className={`flex items-center gap-3 border-b p-4 ${isOpen ? "" : "justify-center px-2"}`}
      >
        <Image
          src={(isLoggedIn && user?.image) || avatar}
          alt={isLoggedIn ? (user?.name ?? "사용자") : "게스트"}
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        {isOpen &&
          (isLoggedIn ? (
            <>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {user?.name ?? "게스트"}
                </p>
                <p className="truncate text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex-1 rounded-lg bg-blue-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-800"
            >
              로그인
            </Link>
          ))}
      </div>

      <nav className={`flex flex-1 flex-col gap-1 p-4 ${isOpen ? "" : "px-2"}`}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={isOpen ? undefined : label}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isOpen ? "" : "justify-center px-0"
            } ${
              pathname === href
                ? "bg-blue-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} className="shrink-0" />
            {isOpen && label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
