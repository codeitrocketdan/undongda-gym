"use client";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
interface User {
  email: string;
  name: string;
  image: string | null;
}
interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

const fetchUser = async () => {
  const response = await fetch("/api/users/me", { cache: "no-store" });
  console.log(fetchUser, "fetchUser 함수 실행");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error("유저 정보 조회 실패");
  }
  return response.json();
};

const AuthClientProvider = ({
  children,
  hasToken,
}: {
  children: React.ReactNode;
  hasToken: boolean;
}) => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    enabled: hasToken,
    retry: false,
    refetchOnWindowFocus: true,
  });
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthClientProvider;
