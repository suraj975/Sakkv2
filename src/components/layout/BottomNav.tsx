"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, Calculator, Hammer, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

const NAV_ITEMS = [
  { id: "home", href: "/", label: "Home", Icon: Home },
  { id: "search", href: "/search", label: "Search", Icon: Search },
  { id: "post", href: "/post", label: "", Icon: Plus, isPost: true },
  { id: "auctions", href: "/auctions", label: "Auctions", Icon: Hammer },
  {
    id: "profile",
    href: "/profile",
    label: "Profile",
    Icon: User,
    isProfile: true,
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      <nav
        className="shrink-0 flex items-center h-20 lg:hidden rounded-t-3xl"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(187,202,199,0.15)",
          boxShadow: "0 -4px 18px rgba(0,0,0,0.07)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, pathname);

          if (item.isPost) {
            return (
              <div key={item.id} className="flex-1 flex justify-center">
                <Link
                  href={item.href}
                  className="w-14 h-14 -mt-6 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: "var(--primary)",
                    boxShadow: "0 4px 16px rgba(0,106,102,0.35)",
                  }}
                >
                  <Plus size={28} strokeWidth={2.5} />
                </Link>
              </div>
            );
          }

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
