"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  ClipboardList,
  Heart,
  Gavel,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu({
  variant = "light",
  placement = "bottom",
}: {
  variant?: "light" | "dark";
  placement?: "bottom" | "top" | "right";
}) {
  const { user, profile, logout } = useAuth();
  const isDark = variant === "dark";
  const opensUp = placement === "top";
  const opensRight = placement === "right";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = profile?.displayName ?? user?.displayName ?? "My Account";
  const email = profile?.email ?? user?.email ?? "";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
        style={{
          background: open
            ? isDark
              ? "rgba(12,191,184,0.15)"
              : "rgba(0,106,102,0.1)"
            : "transparent",
          color: isDark ? "rgba(229,249,248,0.9)" : "var(--on-surface)",
        }}
      >
        {/* Avatar */}
        {user?.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: "var(--primary)" }}
          >
            {initials || <User size={14} />}
          </div>
        )}
        <span className="text-sm font-bold hidden xl:block max-w-25 truncate">
          {displayName}
        </span>
        <ChevronDown
          size={14}
          className="transition-transform"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: isDark ? "rgba(255,255,255,0.5)" : "var(--outline)",
          }}
        />
      </button>

      {open && (
        <div
          className={`absolute z-[200] w-56 overflow-hidden rounded-2xl ${
            opensRight
              ? "left-full bottom-0 ml-3"
              : opensUp
                ? "right-0 bottom-full mb-2"
                : "right-0 top-full mt-2"
          }`}
          style={{
            background: "var(--surface-container-low)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
            border: "1px solid var(--surface-container)",
          }}
        >
          {/* Profile header */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid var(--surface-container)" }}
          >
            <p
              className="text-sm font-bold truncate"
              style={{ color: "var(--on-surface)" }}
            >
              {displayName}
            </p>
            <p
              className="text-xs truncate mt-0.5"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {email}
            </p>
            {profile?.isVerified && (
              <span
                className="mt-1.5 inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,110,45,0.12)", color: "#006E2D" }}
              >
                Verified Seller
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <MenuLink
              href="/profile"
              Icon={User}
              label="My Profile"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/profile/listings"
              Icon={ClipboardList}
              label="My Listings"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/profile/bids"
              Icon={Gavel}
              label="My Bids"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/profile/watchlist"
              Icon={Heart}
              label="Watchlist"
              onClick={() => setOpen(false)}
            />
          </div>

          <div
            style={{ borderTop: "1px solid var(--surface-container)" }}
            className="py-1.5"
          >
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-left"
              style={{ color: "#BA1A1A" }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  Icon,
  label,
  onClick,
}: {
  href: string;
  Icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
      style={{ color: "var(--on-surface)", textDecoration: "none" }}
    >
      <Icon size={15} style={{ color: "var(--outline)" }} />
      {label}
    </Link>
  );
}
