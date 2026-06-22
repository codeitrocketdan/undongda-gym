"use client";
import { User, useUserQuery } from "@/entities/user";
import { createContext, useContext } from "react";

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
  hasToken,
}: {
  children: React.ReactNode;
  hasToken: boolean;
}) {
  const { user, isLoading, isError, isAuthenticated } = useUserQuery(hasToken);
  console.log(user, "유저");
  return (
    <AuthContext.Provider value={{ user, isLoading, isError, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
