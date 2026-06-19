"use client";
import { useUser } from "@/shared/hooks/useUser";

const ADMIN_EMAIL = "admin@admin.com";

export function useIsAdmin() {
  const { user } = useUser();
  return user?.email === ADMIN_EMAIL;
}
