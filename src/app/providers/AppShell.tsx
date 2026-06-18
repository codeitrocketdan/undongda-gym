"use client";

import { usePathname } from "next/navigation";

interface AppShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ header, children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </>
  );
}
