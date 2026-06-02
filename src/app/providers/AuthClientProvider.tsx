"use client";

import { createContext, useContext } from "react";

import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string;
  image: string | null;
  createAt: string;
  updateAt: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);

const fetchUser = async (): Promise<User | null> => {
  const response = await fetch("/api/users/me");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("유저 정보 조회 실패");
  }

  return response.json();
};

export default function AuthClientProvider({
  children,
  hasToken,
}: {
  children: React.ReactNode;
  hasToken: boolean;
}) {
  const { data: user = null } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: hasToken,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: false,

    refetchOnMount: false,

    refetchOnWindowFocus: true,
  });

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
