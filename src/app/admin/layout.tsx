import { AdminShell } from "@/features/admin";
import { UserProfileDTO } from "@/features/my-page/types";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { redirect } from "next/navigation";

// 백엔드 유저 스키마에 role/isAdmin이 아직 없어서 임시로 이메일로 관리자를 구분함
// (role 필드 추가되면 이 체크를 교체해야 함)
const ADMIN_EMAIL = "admin@admin.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: UserProfileDTO;
  try {
    user = await serverFetcher.get<UserProfileDTO>("/users/me");
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/login");
    }
    throw error;
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
