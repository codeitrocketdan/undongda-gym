import { getMe } from "@/shared/lib/auth/getMe";
import React from "react";
import AuthClientProvider from "./AuthClientProvider";

const AuthProvider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getMe();
  return <AuthClientProvider user={user}>{children}</AuthClientProvider>;
};

export default AuthProvider;
