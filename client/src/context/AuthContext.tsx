import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/api";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  systemRole: "ADMIN" | "USER";
  memberships?: Array<{
    id: string;
    roleInGroup: "OWNER" | "TREASURER" | "MANAGER" | "MEMBER";
    payoutPosition?: number;
    group: {
      id: string;
      name: string;
      status: string;
      frequency: string;
      contributionAmount: string;
      totalCycles: number;
    };
  }>;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await apiRequest<{ user: UserProfile | null }>("/auth/me");
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{ user: UserProfile }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(res.user);
    await refreshUser();
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    const res = await apiRequest<{ user: UserProfile }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, phone, password }),
    });
    setUser(res.user);
    await refreshUser();
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
