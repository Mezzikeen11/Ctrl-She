import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type UserRole = "cliente" | "emprendedora" | "admin";

export interface DemoUser {
  email: string;
  name: string;
  role: UserRole;
}

const demoUsers: Array<DemoUser & { password: string }> = [
  { email: "cliente@ctrlshe.demo", password: "demo123", name: "Cliente turista", role: "cliente" },
  { email: "lupita@ctrlshe.demo", password: "demo123", name: "Lupita Hernandez", role: "emprendedora" },
  { email: "admin@ctrlshe.demo", password: "demo123", name: "Admin Ctrl + She", role: "admin" }
];

interface AuthContextValue {
  currentUser: DemoUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => DemoUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const sessionKey = "ctrl-she-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    const saved = localStorage.getItem(sessionKey);
    return saved ? JSON.parse(saved) : null;
  });

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    role: currentUser?.role || null,
    login(email, password) {
      const found = demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase().trim() && user.password === password);
      if (!found) return null;
      const user = { email: found.email, name: found.name, role: found.role };
      localStorage.setItem(sessionKey, JSON.stringify(user));
      setCurrentUser(user);
      return user;
    },
    logout() {
      localStorage.removeItem(sessionKey);
      setCurrentUser(null);
    }
  }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
