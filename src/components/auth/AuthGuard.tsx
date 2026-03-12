"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/register"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Public routes — never redirect
    if (PUBLIC_ROUTES.includes(pathname)) return;

    if (!user) {
      router.replace("/register");
      return;
    }

    if (!user.onboardingComplete && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }
  }, [isLoading, user, pathname, router]);

  // During localStorage hydration — show a minimal spinner instead of blank page
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="text-4xl animate-pulse">🌿</span>
        </div>
      </div>
    );
  }

  // Public routes — always render regardless of auth state
  if (PUBLIC_ROUTES.includes(pathname)) return <>{children}</>;

  // About to redirect — don't render page content
  if (!user) return null;
  if (!user.onboardingComplete && pathname !== "/onboarding") return null;

  return <>{children}</>;
}
