"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Hammer, Calculator, CarFront, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

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
  const { user, loading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  if (loading || !user) return null;

  const onPlatesRoute = pathname.startsWith("/plates");

  // Swap "Auctions" for "Plates" when on a plates route
  const navItems = NAV_ITEMS.map((item) =>
    item.id === "auctions" && onPlatesRoute
      ? { id: "plates", href: "/search", label: "Plates", Icon: CarFront }
      : item,
  );

  return (
    <>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 mx-auto flex h-20 max-w-screen-md items-center rounded-t-[32px] px-2 lg:hidden"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(187,202,199,0.15)",
          boxShadow: "0 -4px 18px rgba(0,0,0,0.07)",
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
                  className="flex-1 flex flex-col items-center justify-center gap-1 pb-1 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <item.Icon
                    size={22}
                    strokeWidth={1.6}
                    style={{ color: "#94A3B8" }}
                  />
                  <span
                    className="text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: "#94A3B8" }}
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
              className="flex-1 flex flex-col items-center justify-center gap-1 pb-1 transition-colors"
            >
              <item.Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                style={{ color: active ? "var(--primary)" : "#94A3B8" }}
              />
              <span
                className="text-[9px] font-semibold uppercase tracking-wider"
                style={{ color: active ? "var(--primary)" : "#94A3B8" }}
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
