"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ListFilter, Clock } from "lucide-react";
import AuctionCard, {
  AuctionCardMobile,
} from "@/components/plates/AuctionCard";
import { getAuctionPlates } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";

const DESKTOP_TABS = ["Ending Soon", "Newly Listed", "All", "Premium Only"];
const MOBILE_TABS = ["Ending Soon", "Newly Listed", "All"];

export default function AuctionsPage() {
  const [desktopTab, setDesktopTab] = useState(0);
  const [mobileTab, setMobileTab] = useState(0);
  const [auctionPlates, setAuctionPlates] = useState<FSPlate[]>([]);
  const router = useRouter();

  useEffect(() => {
    getAuctionPlates()
      .then(setAuctionPlates)
      .catch((err) => console.error("Failed to load auctions:", err));
  }, []);

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
          Madmoon UAE
        </span>
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Bell size={18} strokeWidth={1.8} />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <ListFilter size={18} strokeWidth={1.8} />
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
          Auctions
        </h1>
        <div className="flex items-center gap-3">
          {/* Desktop search bar */}
          <div
            className="flex items-center gap-2 px-3 h-9 rounded-full text-sm"
            style={{
              background: "var(--surface-container-low)",
              border: "1px solid rgba(187,202,199,0.25)",
              color: "var(--outline)",
              width: 220,
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-[13px]">Search plates...</span>
          </div>
          <button
            className="w-9 h-9 flex items-center justify-center cursor-pointer bg-transparent border-none"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Bell size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* ══════════════════════ MOBILE LAYOUT ══════════════════════ */}
      <div className="lg:hidden pb-28">
        {/* Urgency Banner — amber on mobile */}
        <div className="px-4 pt-3">
          <div
            className="rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
            style={{
              background: "#FFFBEB",
              border: "1px solid rgba(217,119,6,0.25)",
            }}
          >
            <Clock
              size={14}
              strokeWidth={2}
              style={{ color: "#D97706", flexShrink: 0 }}
            />
            <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
              3 premium auctions ending in less than 2 hours
            </p>
          </div>
        </div>

        {/* Title row — heading + count pill + filter icon inline */}
        <div className="px-4 pt-4 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2
              className="text-[28px] font-black tracking-tight leading-none"
              style={{ color: "var(--on-surface)" }}
            >
              Live Auctions
            </h2>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(0,106,102,0.1)",
                color: "var(--primary)",
              }}
            >
              {auctionPlates.length} LIVE
            </span>
          </div>
          <button
            className="w-9 h-9 flex items-center justify-center cursor-pointer bg-transparent border-none"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <ListFilter size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Filter pills */}
        <div className="px-4 mb-5">
          <div className="flex gap-2" style={{ scrollbarWidth: "none" }}>
            {MOBILE_TABS.map((t, i) => (
              <button
                key={i}
                onClick={() => setMobileTab(i)}
                className="flex-none px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer border-none transition-colors"
                style={
                  mobileTab === i
                    ? { background: "var(--primary)", color: "white" }
                    : {
                        background: "var(--surface-container-low)",
                        color: "var(--on-surface-variant)",
                        border: "1px solid rgba(187,202,199,0.3)",
                      }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2-col grid with mobile auction cards */}
        <div className="px-4 grid grid-cols-2 gap-3">
          {auctionPlates.map((p, i) => (
            <AuctionCardMobile key={p.id} plate={p} index={i} />
          ))}
        </div>

        {/* Expert Appraisal promo card */}
        <div
          className="mx-4 mt-6 rounded-2xl p-6 cursor-pointer overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
          }}
        >
          {/* Decorative faded calculator icon */}
          <div className="absolute right-4 bottom-4 opacity-10">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="white">
              <rect x="2" y="2" width="20" height="20" rx="3" fill="white" />
              <rect x="6" y="6" width="12" height="3" rx="1" fill="#063D3A" />
              <circle cx="7" cy="13" r="1" fill="#063D3A" />
              <circle cx="12" cy="13" r="1" fill="#063D3A" />
              <circle cx="17" cy="13" r="1" fill="#063D3A" />
              <circle cx="7" cy="17" r="1" fill="#063D3A" />
              <circle cx="12" cy="17" r="1" fill="#063D3A" />
              <circle cx="17" cy="17" r="1" fill="#063D3A" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white leading-tight mb-2">
            Expert Appraisal
            <br />
            Services
          </h3>
          <p className="text-sm text-white opacity-80 mb-5 max-w-[210px] leading-snug">
            Know the true market value of your asset before you sell.
          </p>
          <button
            className="px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer border-none"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}
          >
            Start Valuation
          </button>
        </div>
      </div>

      {/* ══════════════════════ DESKTOP LAYOUT ══════════════════════ */}
      <div className="hidden lg:block">
        {/* Full-width urgency banner — Stitch: bg-primary-container text-on-primary-container */}
        <div
          className="flex items-center justify-center gap-2 px-8 py-3"
          style={{
            background: "var(--primary-container)",
            color: "var(--on-primary-container)",
          }}
        >
          <Clock size={15} strokeWidth={2} className="animate-pulse" />
          <p className="text-sm font-semibold">
            5 plates ending in the next hour — bid now
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 pt-8 pb-12 space-y-6">
          {/* Title + tabs */}
          <div>
            <div className="flex items-end justify-between mb-1">
              <div>
                <h2
                  className="text-[36px] font-black tracking-tight leading-none"
                  style={{ color: "var(--on-surface)" }}
                >
                  Live Auctions
                </h2>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Bid on exclusive UAE number plates from across the emirates.
                </p>
              </div>
              <button
                onClick={() => router.push("/search")}
                className="text-sm font-semibold cursor-pointer bg-transparent border-none"
                style={{ color: "var(--primary)", marginBottom: 6 }}
              >
                Browse All Plates →
              </button>
            </div>

            {/* Underline tabs */}
            <div
              className="flex gap-0 mt-6"
              style={{ borderBottom: "1px solid rgba(187,202,199,0.25)" }}
            >
              {DESKTOP_TABS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setDesktopTab(i)}
                  className="px-5 py-3 text-sm font-semibold cursor-pointer bg-transparent border-none transition-colors"
                  style={{
                    color:
                      desktopTab === i
                        ? "var(--primary)"
                        : "var(--on-surface-variant)",
                    borderBottom:
                      desktopTab === i
                        ? "2px solid var(--primary)"
                        : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 4-col grid with desktop auction cards */}
          <div className="grid grid-cols-4 gap-5">
            {auctionPlates.map((p, i) => (
              <AuctionCard key={p.id} plate={p} index={i} />
            ))}
          </div>

          {/* Bottom promo cards — Stitch: lg:grid-cols-3, elite=col-span-2, trust=col-span-1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Elite Collection — 2/3 width */}
            <div
              className="lg:col-span-2 rounded-3xl p-8 flex flex-col justify-between min-h-[200px] cursor-pointer overflow-hidden relative"
              style={{
                background:
                  "linear-gradient(135deg, #063D3A 0%, var(--primary) 60%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "url('/car-bg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-white opacity-60 mb-3">
                  Madmoon Exclusive
                </p>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Elite Collection:
                  <br />
                  Supercar Plates
                </h3>
                <p className="text-sm text-white opacity-75 mt-2 max-w-[260px] leading-snug">
                  Access the most exclusive double and triple digit plates
                  ending this weekend.
                </p>
              </div>
              <button
                className="relative z-10 self-start mt-4 px-5 py-2 rounded-lg text-sm font-bold border-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                View Collection
              </button>
            </div>

            {/* Authenticated Assets */}
            <div
              className="rounded-3xl p-8 flex flex-col justify-between min-h-[200px] cursor-pointer"
              style={{
                background: "var(--surface-container-low)",
                border: "1px solid rgba(187,202,199,0.18)",
              }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "rgba(0,106,102,0.1)" }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3
                  className="text-2xl font-black leading-tight"
                  style={{ color: "var(--on-surface)" }}
                >
                  Authenticated
                  <br />
                  Assets
                </h3>
                <p
                  className="text-sm mt-2 leading-snug"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  All auction assets are verified with RTA and relevant
                  authorities for immediate transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
