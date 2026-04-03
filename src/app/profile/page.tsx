"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe2,
  LogOut,
  Moon,
  ShieldCheck,
  Star,
  Sun,
  UserRound,
  Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import AuthGateModal from "@/components/auth/AuthGateModal";

function stat(value: string, label: string) {
  return { value, label };
}

export default function ProfilePage() {
  const { user, profile, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [loginOpen, setLoginOpen] = useState(false);

  // Show auth gate for unauthenticated users
  if (!loading && !user) {
    return (
      <>
        {loginOpen && (
          <AuthGateModal
            destinationHref="/profile"
            onClose={() => setLoginOpen(false)}
          />
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "var(--surface-container-high)" }}
          >
            <UserRound size={36} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h2
              className="text-2xl font-black"
              style={{ color: "var(--on-surface)" }}
            >
              Sign in to view your profile
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Track your bids, purchases, and wallet balance.
            </p>
          </div>
          <button
            onClick={() => setLoginOpen(true)}
            className="px-8 py-3 rounded-2xl text-sm font-bold cursor-pointer border-none"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            Sign In / Register
          </button>
        </div>
      </>
    );
  }

  // Loading state while auth resolves
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--primary)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  const displayName = profile?.displayName ?? user?.displayName ?? "My Account";
  const email = profile?.email ?? user?.email ?? "No email connected";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SA";

  const stats = [
    stat(String(profile?.totalSales ?? 0), "Sales"),
    stat(String(profile?.totalPurchases ?? 0), "Purchases"),
    stat(`${profile?.rating?.toFixed(1) ?? "0.0"}`, "Rating"),
  ];

  const menu = [
    {
      label: "Verification Status",
      value: profile?.isVerified ? "Verified" : "Pending",
      Icon: ShieldCheck,
    },
    {
      label: "Wallet Balance",
      value: `AED ${(profile?.walletBalance ?? 0).toLocaleString()}`,
      Icon: Wallet,
    },
    {
      label: "Reviews",
      value: `${profile?.reviewCount ?? 0} total`,
      Icon: Star,
    },
    { label: "Notifications", value: "Manage alerts", Icon: Bell },
    { label: "Payment Methods", value: "Saved cards", Icon: CreditCard },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--surface)]">
      <section
        className="px-4 pb-10 pt-8"
        style={{
          background: "linear-gradient(180deg, #133D3A 0%, #152F2F 100%)",
        }}
      >
        <div className="mx-auto max-w-md">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/55">
            Profile
          </p>
          <div className="mt-5 flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #0E7F79 0%, #1CC6C3 100%)",
              }}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-[30px] font-black leading-none text-white">
                {displayName}
              </h1>
              <p className="mt-2 text-sm text-white/70">{email}</p>
              <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--primary-container)]">
                {profile?.isTrustedSeller ? "Trusted Seller" : "Member"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="-mt-7 px-4 pb-8">
        <div className="mx-auto max-w-md space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] px-3 py-4 text-center"
                style={{
                  background: "var(--surface-container-lowest)",
                  border: "1px solid var(--outline-variant)",
                }}
              >
                <p className="text-[22px] font-black text-[var(--primary)]">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--outline)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[26px] p-5"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid var(--outline-variant)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "var(--surface-container-high)" }}
              >
                <UserRound className="text-[var(--primary)]" size={20} />
              </div>
              <div>
                <p className="text-[18px] font-black text-[var(--on-surface)]">
                  Account Overview
                </p>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Keep your Madmoon identity and transaction preferences in one
                  place.
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-[26px] p-5"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid var(--outline-variant)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-1 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "var(--surface-container-high)" }}
              >
                <Globe2 className="text-[var(--primary)]" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[18px] font-black text-[var(--on-surface)]">
                  Regional Expansion
                </p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Saudi Arabia, Qatar, and Oman account support is coming soon.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Saudi Arabia", "Qatar", "Oman"].map((region) => (
                    <span
                      key={region}
                      className="rounded-full bg-[rgba(0,106,102,0.08)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--primary)]"
                    >
                      {region} · Coming Soon
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[26px] p-3"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid var(--outline-variant)",
            }}
          >
            {menu.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[18px] px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--surface-container-high)" }}
                  >
                    <Icon size={18} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-[var(--on-surface)]">
                      {label}
                    </p>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {value}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[var(--outline)]" />
              </div>
            ))}
          </div>

          {/* Dark mode toggle */}
          <div
            className="rounded-[26px] p-5 shadow-[0_10px_36px_rgba(25,28,29,0.08)]"
            style={{ background: "var(--surface-container-lowest)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{
                    background: isDark
                      ? "rgba(12,191,184,0.15)"
                      : "rgba(0,106,102,0.08)",
                  }}
                >
                  {isDark ? (
                    <Moon size={18} style={{ color: "var(--primary)" }} />
                  ) : (
                    <Sun size={18} style={{ color: "var(--primary)" }} />
                  )}
                </div>
                <div>
                  <p
                    className="text-[15px] font-black"
                    style={{ color: "var(--on-surface)" }}
                  >
                    Dark Mode
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {isDark ? "Dark theme active" : "Light theme active"}
                  </p>
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="relative h-7 w-12 rounded-full transition-all duration-300 border-none cursor-pointer"
                style={{
                  background: isDark
                    ? "var(--primary)"
                    : "var(--surface-container-high)",
                }}
              >
                <span
                  className="absolute top-1 h-5 w-5 rounded-full transition-all duration-300"
                  style={{
                    background: isDark ? "white" : "var(--outline)",
                    left: isDark ? "calc(100% - 1.25rem - 4px)" : "4px",
                  }}
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => void logout()}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-[16px] border-none text-[18px] font-black cursor-pointer"
            style={{
              background: "var(--surface-container-high)",
              color: "var(--primary)",
            }}
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
