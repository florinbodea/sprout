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

  // During localStorage hydration — render nothing (prevents flash-redirect)
  if (isLoading) return null;

  // Public routes — always render regardless of auth state
  if (PUBLIC_ROUTES.includes(pathname)) return <>{children}</>;

  // About to redirect — don't render page content
  if (!user) return null;
  if (!user.onboardingComplete && pathname !== "/onboarding") return null;

  return <>{children}</>;
}
