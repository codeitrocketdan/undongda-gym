import { AdminShell } from "@/features/admin";
import { UserProfileDTO } from "@/features/my-page/types";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { ADMIN_EMAIL } from "@/shared/config/admin";
import { redirect } from "next/navigation";

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
