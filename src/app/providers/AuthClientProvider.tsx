"use client";
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

const AuthClientProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) => {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthClientProvider;
