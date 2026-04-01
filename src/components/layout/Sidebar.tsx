"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Calculator,
  UserCircle,
  PlusCircle,
  Hammer,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "home", href: "/", label: "Home", Icon: Home, badge: null },
  { id: "search", href: "/search", label: "Search", Icon: Search, badge: null },
  {
    id: "auctions",
    href: "/auctions",
    label: "Auctions",
    Icon: Hammer,
    badge: "4 Live",
  },
  {
    id: "estimator",
    href: "/estimator",
    label: "Estimator",
    Icon: Calculator,
    badge: null,
  },
  { id: "profile", href: "#", label: "Profile", Icon: UserCircle, badge: null },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-[200px] flex-shrink-0 min-h-screen sticky top-0"
      style={{
        background: "rgba(248,250,251,0.92)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid var(--surface-container)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="text-[20px] font-black"
          style={{ color: "var(--primary)" }}
        >
          Sakk
        </div>
        <div
          className="text-[10px] font-semibold tracking-wider mt-0.5"
          style={{ color: "var(--on-surface-variant)" }}
        >
          UAE PLATE MARKETPLACE
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] select-none"
              style={{
                background: active ? "rgba(0,106,102,0.1)" : "transparent",
                color: active ? "var(--primary)" : "var(--on-surface-variant)",
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
              }}
            >
              <item.Icon
                size={18}
                strokeWidth={active ? 2.5 : 1.8}
                style={{
                  color: active
                    ? "var(--primary)"
                    : "var(--on-surface-variant)",
                  flexShrink: 0,
                }}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active
                      ? "rgba(0,106,102,0.15)"
                      : "rgba(186,26,26,0.1)",
                    color: active ? "var(--primary)" : "var(--error)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Post a Plate button */}
      <div className="px-3 pb-3">
        <Link
          href="/post"
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-bold text-white w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
            boxShadow: "0 4px 14px rgba(0,106,102,0.35)",
            textDecoration: "none",
          }}
        >
          <PlusCircle size={16} strokeWidth={2.5} />
          Post a Plate
        </Link>
      </div>

      {/* 100% Escrow Safe footer */}
      <div className="px-3 pb-5">
        <div
          className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: "rgba(0,106,102,0.08)" }}
        >
          <ShieldCheck
            size={15}
            style={{ color: "var(--primary)", flexShrink: 0 }}
          />
          <div
            className="text-[11px] font-semibold"
            style={{ color: "var(--primary)" }}
          >
            100% Escrow Safe
          </div>
        </div>
      </div>
    </aside>
  );
}
