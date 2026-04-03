"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight, Hammer } from "lucide-react";
import PlateViz from "./PlateViz";
import { aed, aedCompact, timeRemaining } from "@/lib/plates";
import { toISOString } from "@/lib/utils";
import type { FSPlate } from "@/types/firebase";

interface AuctionCardProps {
  plate: FSPlate;
  index?: number;
}

function useCountdown(endTime: string) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
    total: 0,
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(timeRemaining(endTime));
    const id = setInterval(() => setTime(timeRemaining(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return time;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatCountdown(
  days: number,
  hours: number,
  mins: number,
  secs: number,
  total: number,
): string {
  if (total <= 0) return "Ended";
  if (days > 0) return `${days}d ${pad(hours)}h`;
  if (hours > 0) return `${pad(hours)}h ${pad(mins)}m`;
  return `${pad(mins)}m ${pad(secs)}s`;
}

export default function AuctionCard({ plate, index = 0 }: AuctionCardProps) {
  const router = useRouter();
  const delay = Math.min(index, 7) + 1;
  const time = useCountdown(toISOString(plate.auctionEndTime));
  const isUrgent = time.total > 0 && time.total < 60 * 60 * 1000;
  const countdownLabel = formatCountdown(
    time.days,
    time.hours,
    time.mins,
    time.secs,
    time.total,
  );
  const bidAmount = aed(plate.currentBid ?? 0);

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`animate-fade-up stagger-${delay} group cursor-pointer flex flex-col overflow-hidden transition-all hover:scale-[1.02]`}
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: 12,
        boxShadow: "0 4px 18px rgba(25,28,29,0.12)",
        padding: 20,
      }}
    >
      {/* ── Top row: LIVE badge + Ends in ── */}
      <div className="flex justify-between items-start mb-5">
        {/* LIVE badge — Stitch: bg-error/10 text-error */}
        <span
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold"
          style={{
            background: "rgba(186,26,26,0.1)",
            color: "var(--error)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: "var(--error)" }}
          />
          LIVE
        </span>
        <div className="flex flex-col items-end">
          <span
            className="text-xs"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Ends in
          </span>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: isUrgent ? "var(--error)" : "var(--primary)" }}
          >
            {countdownLabel}
          </span>
        </div>
      </div>

      {/* ── Plate visualisation ── */}
      <div
        className="flex items-center justify-center rounded-[8px] mb-5 overflow-hidden"
        style={{
          background: "var(--primary)",
          height: 128,
        }}
      >
        <PlateViz
          code={plate.code}
          num={plate.num}
          emirate={plate.emirate}
          type={plate.type}
          size="md"
        />
      </div>

      {/* ── Bid info ── */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <p
            className="text-xs mb-1"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Current Bid
          </p>
          <p
            className="text-xl font-black"
            style={{ color: "var(--on-surface)" }}
          >
            {bidAmount}
          </p>
        </div>
        <p
          className="text-[10px] pb-0.5"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {plate.bidCount} bids
        </p>
      </div>

      {/* ── Place Bid button — Stitch: surface-container-high bg, hover to primary ── */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/plates/${plate.id}/auction/bid`);
        }}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-bold cursor-pointer transition-all"
        style={{
          background: "var(--surface-container-high)",
          color: "var(--primary)",
          border: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--primary)";
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--on-primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--surface-container-high)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
        }}
      >
        <Hammer size={13} strokeWidth={2} />
        Place Bid
      </button>
    </div>
  );
}

/** Compact mobile variant — used in 2-col grid on /auctions mobile */
export function AuctionCardMobile({ plate, index = 0 }: AuctionCardProps) {
  const router = useRouter();
  const delay = Math.min(index, 7) + 1;
  const time = useCountdown(toISOString(plate.auctionEndTime));
  const isUrgent = time.total > 0 && time.total < 60 * 60 * 1000;
  const countdownLabel = formatCountdown(
    time.days,
    time.hours,
    time.mins,
    time.secs,
    time.total,
  );
  const bidAmount = aedCompact(plate.currentBid ?? 0);

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`animate-fade-up stagger-${delay} cursor-pointer relative flex flex-col overflow-hidden`}
      style={{
        background: "var(--surface-container-lowest)",
        border: "1px solid rgba(187,202,199,0.18)",
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(25,28,29,0.06)",
      }}
    >
      {/* LIVE badge — absolute top-left */}
      <div
        className="absolute top-2 left-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
        style={{ background: "#DC2626" }}
      >
        <span className="w-1 h-1 rounded-full bg-white opacity-90 flex-shrink-0" />
        <span className="text-[8px] font-black uppercase tracking-wider text-white">
          LIVE
        </span>
      </div>

      {/* Plate */}
      <div
        className="flex items-center justify-center pt-8 pb-3 px-3"
        style={{ background: "var(--primary)", minHeight: 110 }}
      >
        <PlateViz
          code={plate.code}
          num={plate.num}
          emirate={plate.emirate}
          type={plate.type}
          size="sm"
        />
      </div>

      {/* Data rows */}
      <div className="px-3 pt-2 pb-3 space-y-1.5">
        {/* Current Bid row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-medium"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Current Bid
          </span>
          <span
            className="text-xs font-black"
            style={{ color: "var(--primary)" }}
          >
            {bidAmount}
          </span>
        </div>

        {/* Countdown row */}
        <div className="flex items-center gap-1">
          <Clock
            size={10}
            strokeWidth={2}
            style={{
              color: isUrgent ? "#DC2626" : "var(--outline)",
              flexShrink: 0,
            }}
          />
          <span
            className="text-[10px] font-semibold tabular-nums"
            style={{
              color: isUrgent ? "#DC2626" : "var(--on-surface-variant)",
            }}
          >
            {countdownLabel}
          </span>
        </div>

        {/* Bids count + arrow */}
        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: "var(--outline)" }}>
            {plate.bidCount} bids
          </span>
          <ArrowRight
            size={12}
            strokeWidth={2}
            style={{ color: "var(--primary)" }}
          />
        </div>
      </div>
    </div>
  );
}
