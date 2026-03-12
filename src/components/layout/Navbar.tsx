"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/list", label: "List", icon: "🛒" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar — desktop */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <span className="text-2xl">🌿</span>
          <span>Sprout</span>
        </Link>
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
      </header>

      {/* Bottom tab bar — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex bg-white border-t border-gray-100 safe-area-pb">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition",
                active ? "text-emerald-600" : "text-gray-400"
              )}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
