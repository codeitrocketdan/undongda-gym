"use client";

import { useNewFavoritesCount } from "@/shared/hooks/useNewFavoritesCount";
import { resetFavoritesCount } from "@/shared/hooks/useNewFavoritesCount";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NavItem } from "./types";

interface NavLinksProps {
  navItems: NavItem[];
}

export default function NavLinks({ navItems }: NavLinksProps) {
  const pathname = usePathname();
  const newCount = useNewFavoritesCount();

  useEffect(() => {
    if (pathname === "/favorite") {
      resetFavoritesCount();
    }
  }, [pathname]);

  return (
    <ul className="hidden gap-2 md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`p-4 font-medium transition-colors ${
                isActive ? "font-semibold text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="relative inline-block">
                {item.label}
                {item.href === "/favorite" && newCount > 0 && (
                  <span className="absolute top-1/2 left-full ml-1 -translate-y-1/2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white">
                    {newCount > 9 ? "9+" : newCount}
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
