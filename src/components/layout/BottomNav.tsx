"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Hammer, Calculator, CarFront, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthGateModal from "@/components/auth/AuthGateModal";

const NAV_ITEMS = [
  { id: "home", href: "/home", label: "Home", Icon: Home },
  { id: "search", href: "/search", label: "Search", Icon: Search },
  { id: "auctions", href: "/auctions", label: "Auctions", Icon: Hammer },
  { id: "estimator", href: "/estimator", label: "Estimator", Icon: Calculator },
  {
    id: "profile",
    href: "/profile",
    label: "Profile",
    Icon: User,
    isProfile: true,
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/home") return pathname === "/home";
  return pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const onPlatesRoute = pathname.startsWith("/plates");

  // Swap "Auctions" for "Plates" when on a plates route
  const navItems = NAV_ITEMS.map((item) =>
    item.id === "auctions" && onPlatesRoute
      ? { id: "plates", href: "/search", label: "Plates", Icon: CarFront }
      : item,
  );

  return (
    <>
      {loginOpen && (
        <AuthGateModal
          destinationHref="/profile"
          onClose={() => setLoginOpen(false)}
        />
      )}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 mx-auto flex h-20 max-w-screen-md items-center rounded-t-[32px] px-2 lg:hidden"
        style={{
          background: "var(--teal-darker)",
          borderTop: "1px solid rgba(12,191,184,0.15)",
          boxShadow: "0 -4px 24px rgba(6,61,58,0.35)",
          paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
        }}
      >
        {navItems.map((item) => {
          const active =
            item.id === "plates"
              ? onPlatesRoute
              : isActive(item.href, pathname);

          if ("isProfile" in item && item.isProfile) {
            // Profile tab: open login modal if not authed, else navigate
            if (!user) {
              return (
                <button
                  key={item.id}
                  onClick={() => setLoginOpen(true)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 pb-1 transition-all bg-transparent border-none cursor-pointer"
                >
                  <div
                    className="flex items-center justify-center w-12 h-7 rounded-full"
                    style={{ background: "transparent" }}
                  >
                    <item.Icon
                      size={22}
                      strokeWidth={1.6}
                      style={{ color: "rgba(229,249,248,0.45)" }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(229,249,248,0.45)" }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 pb-1 transition-all"
            >
              <div
                className="flex items-center justify-center w-12 h-7 rounded-full transition-all"
                style={{
                  background: active ? "rgba(12,191,184,0.18)" : "transparent",
                }}
              >
                <item.Icon
                  size={active ? 22 : 20}
                  strokeWidth={active ? 2.4 : 1.6}
                  style={{
                    color: active
                      ? "var(--primary-container)"
                      : "rgba(229,249,248,0.45)",
                  }}
                />
              </div>
              <span
                className="text-[9px] font-semibold uppercase tracking-wider transition-all"
                style={{
                  color: active
                    ? "var(--primary-container)"
                    : "rgba(229,249,248,0.45)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
