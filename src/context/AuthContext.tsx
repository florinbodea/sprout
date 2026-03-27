"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser, AUTH_STORAGE_KEY } from "@/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  /** true while localStorage is being read on mount — prevents flash-redirects */
  isLoading: boolean;
  register: (name: string, email: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore quota / private-mode errors
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setUser(loadUser());
    setIsLoading(false);
  }, []);

  // Persist whenever user changes (skip initial null before hydration)
  useEffect(() => {
    if (!isLoading) {
      saveUser(user);
    }
  }, [user, isLoading]);

  const register = useCallback((name: string, email: string) => {
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      registeredAt: new Date().toISOString(),
      onboardingComplete: false,
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    setUser((prev) =>
      prev ? { ...prev, onboardingComplete: true } : prev
    );
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, register, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
