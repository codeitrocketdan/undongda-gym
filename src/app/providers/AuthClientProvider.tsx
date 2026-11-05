"use client";
import { createContext, useContext, useEffect } from "react";
import { User, useUserQuery } from "@/entities/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isError: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isError, isAuthenticated } = useUserQuery();

  // 조회가 끝나면 <html data-auth>를 실제 로그인 상태와 동기화 (새로고침 없는 로그인·로그아웃 대응)
  useEffect(() => {
    if (isLoading) return;
    document.documentElement.dataset.auth = isAuthenticated ? "in" : "out";
  }, [isLoading, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
