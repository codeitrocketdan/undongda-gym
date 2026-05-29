"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./types";

interface NavLinksProps {
  navItems: NavItem[];
}
export default function NavLinks({ navItems }: NavLinksProps) {
  const pathname = usePathname();
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
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
