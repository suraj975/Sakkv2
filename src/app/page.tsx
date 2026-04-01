"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  HelpCircle,
  Zap,
  Gift,
  Car,
  Bike,
  Anchor,
  Tag,
  ShoppingCart,
  Hammer,
} from "lucide-react";
import PlateCard from "@/components/plates/PlateCard";
import { PLATES, getAuctionPlates } from "@/lib/plates";

const CHIPS = ["Car", "Bike", "Boat"];

const AUCTION_PLATES = getAuctionPlates();

const DESKTOP_CATS = [
  { l: "Car Plates", c: "4,823 Active", active: true, Icon: Car },
  { l: "Bike Plates", c: "891 Active", active: false, Icon: Bike },
  { l: "Boat Numbers", c: "234 Active", active: false, Icon: Anchor },
];

const DESKTOP_QUICK = [
  {
    l: "Deals",
    sub: "Hand-picked value plates",
    Icon: Tag,
    href: "/search?q=deals",
  },
  {
    l: "Quick Sale",
    sub: "Emergency listings",
    Icon: Zap,
    href: "/search?q=quick",
  },
  {
    l: "Gift a Plate",
    sub: "Transfer as digital voucher",
    Icon: Gift,
    href: "/plates/3/gift",
  },
];

const TABS = ["Car Plates", "Bike Plates", "Boat Numbers"];

export default function HomePage() {
  const [tab, setTab] = useState(0);
  const [chip, setChip] = useState(0);
  const router = useRouter();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── Mobile Top Nav ── */}
      <nav
        className="lg:hidden sticky top-0 z-40 glass-nav flex justify-between items-center px-4 h-14"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <span
          className="text-xl font-black"
          style={{ color: "var(--on-surface)" }}
        >
          Sakk
        </span>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
            style={{ color: "var(--primary)" }}
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.8} />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
            style={{ color: "var(--primary)" }}
            aria-label="Help"
          >
            <HelpCircle size={18} strokeWidth={1.8} />
          </button>
        </div>
      </nav>

      {/* ── Desktop Header ── */}
      <header
        className="hidden lg:flex sticky top-0 z-40 glass-nav justify-between items-center px-8 h-16"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <h1
          className="text-xl font-black tracking-tight"
          style={{ color: "var(--on-surface)" }}
        >
          Marketplace
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Bell size={18} strokeWidth={1.8} />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <HelpCircle size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* ══════════════════════ MOBILE LAYOUT ══════════════════════ */}
      <div className="lg:hidden px-4 pt-5 pb-28 max-w-md mx-auto space-y-6">
        {/* Hero Banner */}
        <section
          className="relative overflow-hidden rounded-2xl p-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
          }}
        >
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[2px] opacity-80">
              Marketplace Exclusive
            </span>
            <h2 className="text-[22px] font-black leading-tight">
              Safe Plate Transfers
            </h2>
            <p className="text-sm opacity-90 max-w-[190px] leading-snug">
              Secure escrow-backed transactions for elite UAE assets.
            </p>
            <button
              onClick={() => router.push("/search")}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-bold transition-transform hover:scale-105 cursor-pointer"
              style={{
                background: "var(--surface-container-lowest)",
                color: "var(--primary)",
              }}
            >
              Learn More
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-15 transform rotate-12">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
        </section>

        {/* Category Chips */}
        <div
          className="flex gap-2.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {CHIPS.map((c, i) => (
            <button
              key={i}
              onClick={() => setChip(i)}
              className="flex-none px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer transition-colors"
              style={
                chip === i
                  ? { background: "var(--primary)", color: "var(--on-primary)" }
                  : {
                      background: "var(--surface-container-low)",
                      color: "var(--on-surface-variant)",
                    }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* Flash Deals Banner */}
        <div
          onClick={() => router.push("/search?q=deals")}
          className="rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
          style={{ background: "var(--teal-light)" }}
        >
          <div>
            <h3
              className="font-bold text-sm"
              style={{ color: "var(--primary)" }}
            >
              Flash Deals
            </h3>
            <p
              className="text-xs mt-0.5 opacity-70"
              style={{ color: "var(--primary)" }}
            >
              Limited time plate offers
            </p>
          </div>
          <Zap size={22} style={{ color: "var(--primary)" }} />
        </div>

        {/* Live Auctions (mobile) */}
        {AUCTION_PLATES.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "var(--error)" }}
                />
                <h3
                  className="text-base font-black"
                  style={{ color: "var(--on-surface)" }}
                >
                  Live Auctions
                </h3>
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(186,26,26,0.1)",
                    color: "var(--error)",
                  }}
                >
                  {AUCTION_PLATES.length} LIVE
                </span>
              </div>
              <button
                onClick={() => router.push("/auctions")}
                className="text-xs font-bold cursor-pointer bg-transparent border-none flex items-center gap-1"
                style={{ color: "var(--primary)" }}
              >
                <Hammer size={12} /> View All
              </button>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {AUCTION_PLATES.slice(0, 4).map((p, i) => (
                <div key={p.id} className="flex-none w-[150px]">
                  <PlateCard plate={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Bento */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              l: "Quick Sale",
              sub: "List in 60s",
              Icon: ShoppingCart,
              href: "/search?q=quick",
            },
            {
              l: "Gift a Plate",
              sub: "Transfer ownership",
              Icon: Gift,
              href: "/plates/3/gift",
            },
          ].map((q, i) => (
            <div
              key={i}
              onClick={() => router.push(q.href)}
              className="ambient-shadow rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-transform hover:scale-[1.02]"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
                aspectRatio: "1",
              }}
            >
              <q.Icon
                size={22}
                strokeWidth={1.8}
                style={{
                  color:
                    i === 0 ? "var(--primary-container)" : "var(--tertiary)",
                }}
              />
              <div>
                <h3
                  className="font-bold text-sm mt-2"
                  style={{ color: "var(--on-surface)" }}
                >
                  {q.l}
                </h3>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {q.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Market Stats */}
        <div
          className="rounded-2xl p-4 flex justify-between items-center"
          style={{ background: "var(--surface-container-low)" }}
        >
          <div className="text-center">
            <p
              className="text-[9px] uppercase font-bold tracking-wider"
              style={{ color: "var(--outline)" }}
            >
              Active Listings
            </p>
            <p
              className="text-lg font-black"
              style={{ color: "var(--primary)" }}
            >
              12,482
            </p>
          </div>
          <div
            className="w-px h-7"
            style={{ background: "rgba(187,202,199,0.4)" }}
          />
          <div className="text-center">
            <p
              className="text-[9px] uppercase font-bold tracking-wider"
              style={{ color: "var(--outline)" }}
            >
              Avg. Growth
            </p>
            <p
              className="text-lg font-black"
              style={{ color: "var(--tertiary)" }}
            >
              +14.2%
            </p>
          </div>
          <div
            className="w-px h-7"
            style={{ background: "rgba(187,202,199,0.4)" }}
          />
          <div className="text-center">
            <p
              className="text-[9px] uppercase font-bold tracking-wider"
              style={{ color: "var(--outline)" }}
            >
              Sold Today
            </p>
            <p
              className="text-lg font-black"
              style={{ color: "var(--on-surface)" }}
            >
              342
            </p>
          </div>
        </div>

        {/* Trending Assets */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2
              className="text-xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Trending Assets
            </h2>
            <button
              onClick={() => router.push("/search")}
              className="text-xs font-bold cursor-pointer bg-transparent border-none"
              style={{ color: "var(--primary)" }}
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PLATES.slice(0, 4).map((p, i) => (
              <PlateCard key={p.id} plate={p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════ DESKTOP LAYOUT ══════════════════════ */}
      <div className="hidden lg:block max-w-[1200px] mx-auto px-8 pt-8 pb-12 space-y-10">
        {/* Hero Banner */}
        <section
          className="relative h-[300px] rounded-3xl overflow-hidden flex flex-col justify-center px-12 text-white"
          style={{
            background:
              "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
          }}
        >
          <div className="relative z-10 space-y-3">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[2px] uppercase"
              style={{ background: "rgba(12,191,184,0.2)", color: "#69F8F0" }}
            >
              UAE PLATE MARKETPLACE
            </span>
            <h2 className="text-5xl font-black tracking-tighter leading-none">
              Safe Plate
              <br />
              Transfers
            </h2>
            <div className="flex items-center gap-2">
              <span
                className="font-bold"
                style={{ color: "var(--primary-container)" }}
              >
                Secured by Sakk
              </span>
              <span
                className="w-1 h-1 rounded-full opacity-40 inline-block"
                style={{ background: "white" }}
              />
              <span className="text-sm opacity-60">
                The Middle East&apos;s Premier Asset Exchange
              </span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-3 gap-5">
          {DESKTOP_CATS.map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.02]"
              style={
                c.active
                  ? {
                      background: "rgba(12,191,184,0.1)",
                      border: "2px solid var(--primary-container)",
                    }
                  : {
                      background: "var(--surface-container-lowest)",
                      border: "1px solid rgba(187,202,199,0.15)",
                    }
              }
            >
              <div>
                <p
                  className="font-bold text-lg leading-none"
                  style={{
                    color: c.active ? "var(--primary)" : "var(--on-surface)",
                  }}
                >
                  {c.l}
                </p>
                <p
                  className="text-sm font-medium mt-1"
                  style={{
                    color: c.active
                      ? "rgba(0,106,102,0.6)"
                      : "var(--on-surface-variant)",
                  }}
                >
                  {c.c}
                </p>
              </div>
              <c.Icon
                size={28}
                strokeWidth={1.5}
                style={{
                  color: c.active ? "var(--primary)" : "rgba(60,73,72,0.3)",
                }}
              />
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-3 gap-5">
          {DESKTOP_QUICK.map((q, i) => (
            <div
              key={i}
              onClick={() => router.push(q.href)}
              className="p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.15)",
              }}
            >
              <div>
                <p className="font-bold" style={{ color: "var(--on-surface)" }}>
                  {q.l}
                </p>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {q.sub}
                </p>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "var(--surface-container-low)" }}
              >
                <q.Icon
                  size={18}
                  strokeWidth={1.8}
                  style={{ color: "var(--primary)" }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section
          className="rounded-3xl p-8 grid grid-cols-3 text-center"
          style={{ background: "var(--surface-container-low)" }}
        >
          {[
            { v: "80K+", l: "TRANSFERS / YEAR" },
            { v: "100%", l: "ESCROW SAFE" },
            { v: "GCC", l: "READY" },
          ].map((s, i) => (
            <div
              key={i}
              className={i > 0 ? "border-l" : ""}
              style={{ borderColor: "rgba(187,202,199,0.3)" }}
            >
              <p
                className="text-4xl font-black"
                style={{ color: "var(--primary)" }}
              >
                {s.v}
              </p>
              <p
                className="text-[11px] font-bold tracking-[2px] mt-1"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {s.l}
              </p>
            </div>
          ))}
        </section>

        {/* Live Auctions (desktop) */}
        {AUCTION_PLATES.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: "var(--error)" }}
                />
                <h2
                  className="text-2xl font-black tracking-tight"
                  style={{ color: "var(--on-surface)" }}
                >
                  Live Auctions
                </h2>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(186,26,26,0.1)",
                    color: "var(--error)",
                  }}
                >
                  {AUCTION_PLATES.length} ACTIVE
                </span>
              </div>
              <button
                onClick={() => router.push("/auctions")}
                className="text-sm font-bold cursor-pointer bg-transparent border-none flex items-center gap-1.5"
                style={{ color: "var(--primary)" }}
              >
                <Hammer size={14} /> View all auctions
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {AUCTION_PLATES.map((p, i) => (
                <PlateCard key={p.id} plate={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Plates */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Trending Plates
            </h2>
            <button
              onClick={() => router.push("/search")}
              className="text-sm font-bold cursor-pointer bg-transparent border-none"
              style={{ color: "var(--primary)" }}
            >
              View all
            </button>
          </div>
          <div
            className="flex gap-1 mb-6"
            style={{ borderBottom: "1px solid rgba(187,202,199,0.2)" }}
          >
            {TABS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className="px-4 py-2.5 text-sm font-semibold cursor-pointer bg-transparent border-none transition-colors"
                style={{
                  color:
                    tab === i ? "var(--primary)" : "var(--on-surface-variant)",
                  borderBottom:
                    tab === i
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                  marginBottom: "-1px",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {PLATES.map((p, i) => (
              <PlateCard key={p.id} plate={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
