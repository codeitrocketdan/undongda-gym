import { getAuthCookies } from "@/shared/lib/auth/cookies";
import React from "react";
import AuthClientProvider from "./AuthClientProvider";

const AuthProvider = async ({ children }: { children: React.ReactNode }) => {
  const { accessToken, refreshToken } = await getAuthCookies();

  const hasToken = !!accessToken || !!refreshToken;

  return (
    <AuthClientProvider hasToken={hasToken}>{children}</AuthClientProvider>
  );
};

export default AuthProvider;
