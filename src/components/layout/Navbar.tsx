"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/list", label: "List", icon: "🛒" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/register");
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      {/* Top bar — desktop */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <span className="text-2xl">🌿</span>
          <span>Sprout</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition",
                  pathname === href
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User identity — shown when logged in */}
          {user && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-100">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700 flex-shrink-0">
                {initial}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-gray-600 transition whitespace-nowrap"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Bottom tab bar — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex bg-white border-t border-gray-100 safe-area-pb">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname === href;
          const isProfile = href === "/profile";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition",
                active ? "text-emerald-600" : "text-gray-400"
              )}
            >
              {isProfile && user ? (
                <span
                  className={cn(
                    "text-xs font-bold h-7 w-7 rounded-full flex items-center justify-center leading-none",
                    active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {initial}
                </span>
              ) : (
                <span className="text-xl leading-none">{icon}</span>
              )}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
