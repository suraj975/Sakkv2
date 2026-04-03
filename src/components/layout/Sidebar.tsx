"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Calculator,
  ShieldCheck,
  Gavel,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/auth/UserMenu";
import { subscribeUnreadCount } from "@/lib/firestore";
import Logo from "@/components/ui/Logo";

const NAV_ITEMS = [
  { id: "home", href: "/home", label: "Home", Icon: Home },
  { id: "search", href: "/search", label: "Search", Icon: Search },
  {
    id: "auctions",
    href: "/auctions",
    label: "Auctions",
    Icon: Gavel,
    badge: "4",
  },
  { id: "estimator", href: "/estimator", label: "Estimator", Icon: Calculator },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/home") return pathname === "/home";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsub = subscribeUnreadCount(user.uid, setUnreadCount);
    return unsub;
  }, [user]);

  return (
    <>
      <aside
        className="relative hidden shrink-0 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col"
        style={{
          width: "240px",
          minWidth: "240px",
          maxWidth: "240px",
          background: "var(--teal-darker)",
          borderRight: "1px solid rgba(12,191,184,0.12)",
        }}
      >
        <div className="px-4 pt-8">
          <div className="mb-10 px-2">
            <Logo size="sm" showTagline variant="dark" />
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-[220px]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold sidebar-item",
                  active ? "sidebar-item-active" : "",
                )}
                style={{
                  background: active ? "rgba(12,191,184,0.18)" : "transparent",
                  color: active
                    ? "var(--primary-container)"
                    : "rgba(229,249,248,0.55)",
                  textDecoration: "none",
                  borderLeft: active
                    ? "3px solid var(--primary-container)"
                    : "3px solid transparent",
                  paddingLeft: active ? "13px" : "16px",
                }}
              >
                <item.Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{
                    color: active
                      ? "var(--primary-container)"
                      : "rgba(229,249,248,0.45)",
                  }}
                />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge && (
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                    style={{
                      background: "rgba(12,191,184,0.18)",
                      color: "var(--primary-container)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Notifications */}
          {user && (
            <Link
              href="/notifications"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold sidebar-item",
                pathname === "/notifications" ? "sidebar-item-active" : "",
              )}
              style={{
                background:
                  pathname === "/notifications"
                    ? "rgba(12,191,184,0.18)"
                    : "transparent",
                color:
                  pathname === "/notifications"
                    ? "var(--primary-container)"
                    : "rgba(229,249,248,0.55)",
                textDecoration: "none",
                borderLeft:
                  pathname === "/notifications"
                    ? "3px solid var(--primary-container)"
                    : "3px solid transparent",
                paddingLeft: pathname === "/notifications" ? "13px" : "16px",
              }}
            >
              <Bell
                size={22}
                strokeWidth={pathname === "/notifications" ? 2.5 : 1.8}
                style={{
                  color:
                    pathname === "/notifications"
                      ? "var(--primary-container)"
                      : "rgba(229,249,248,0.45)",
                }}
              />
              <span className="flex-1">Notifications</span>
              {unreadCount > 0 && (
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: "var(--error)", color: "white" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 space-y-3 bg-[var(--teal-darker)] px-4 pb-8 pt-4"
          style={{ borderTop: "1px solid rgba(12,191,184,0.12)" }}
        >
          {/* Auth: show UserMenu when logged in, sign-in button when logged out */}
          {!loading && (
            <div className="mb-3">
              {user ? <UserMenu placement="right" variant="dark" /> : null}
            </div>
          )}
          <Link
            href="/post"
            className="flex items-center justify-center w-full py-3.5 rounded-xl text-[14px] font-black text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 14px rgba(0,106,102,0.28)",
              textDecoration: "none",
            }}
          >
            Post a Plate
          </Link>
          <div
            className="p-3 rounded-xl flex items-center gap-2.5"
            style={{
              background: "rgba(12,191,184,0.06)",
            }}
          >
            <ShieldCheck
              size={16}
              style={{ color: "var(--primary-container)" }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--primary-container)" }}
            >
              100% Escrow Safe
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
