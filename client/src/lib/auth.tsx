import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

type AuthUser = {
  id: string;
  username: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.id) setUser(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast({ title: "Welcome back!", description: `Signed in as ${data.username}` });
        return true;
      } else {
        toast({ title: "Sign in failed", description: data.message, variant: "destructive" });
        return false;
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast({ title: "Welcome!", description: "Your account has been created." });
        return true;
      } else {
        toast({ title: "Sign up failed", description: data.message, variant: "destructive" });
        return false;
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      toast({ title: "Signed out", description: "See you next time!" });
    } catch {
      toast({ title: "Error", description: "Logout failed", variant: "destructive" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
