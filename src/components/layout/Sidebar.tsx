"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Calculator,
  User,
  ShieldCheck,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", href: "/", label: "Home", Icon: Home },
  { id: "search", href: "/search", label: "Search", Icon: Search },
  {
    id: "auctions",
    href: "/auctions",
    label: "Auctions",
    Icon: Hammer,
    badge: "4 Live",
  },
  { id: "estimator", href: "/estimator", label: "Estimator", Icon: Calculator },
  { id: "profile", href: "#", label: "Profile", Icon: User },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-[200px] flex-shrink-0 min-h-screen sticky top-0 py-8 px-4"
      style={{
        background: "var(--surface-container-low)",
        borderRight: "1px solid var(--surface-container)",
      }}
    >
      <div className="mb-10 px-2 flex flex-col gap-1">
        <h1 className="text-2xl font-black" style={{ color: "var(--primary)" }}>
          Sakk
        </h1>
        <p
          className="text-[9px] uppercase tracking-[0.15em] font-bold"
          style={{ color: "var(--outline)" }}
        >
          UAE PLATE MARKETPLACE
        </p>
      </div>

      <nav className="flex-1 space-y-1">
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
                background: active ? "rgba(0,106,102,0.1)" : "transparent",
                color: active ? "var(--primary)" : "var(--on-surface-variant)",
                textDecoration: "none",
              }}
            >
              <item.Icon
                size={18}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? "var(--primary)" : "var(--outline)" }}
              />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,106,102,0.1)",
                    color: "var(--primary)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
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
          style={{ background: "rgba(0,106,102,0.06)" }}
        >
          <ShieldCheck size={16} style={{ color: "var(--primary)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--primary)" }}
          >
            100% Escrow Safe
          </span>
        </div>
      </div>
    </aside>
  );
}
