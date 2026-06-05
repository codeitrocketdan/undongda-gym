"use client";
import { User, useUserQuery } from "@/entities/user";
import { createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
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
  const { user, isLoading, isAuthenticated } = useUserQuery(hasToken);
  console.log(isAuthenticated);
  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
