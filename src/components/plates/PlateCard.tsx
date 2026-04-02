"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import PlateViz from "./PlateViz";
import { aed } from "@/lib/plates";
import { cn, toISOString } from "@/lib/utils";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { FSPlate } from "@/types/firebase";

interface PlateCardProps {
  plate: FSPlate;
  index?: number;
  forceVerified?: boolean;
  hideSellerName?: boolean;
}

function getEmirateAccent(type: FSPlate["type"]) {
  switch (type) {
    case "gold": return "bg-[#C9A84C]";
    case "silver": return "bg-slate-400";
    case "abudhabi": return "bg-[#B22234]";
    case "sharjah": return "bg-[#1A5C1A]";
    default: return "bg-slate-700";
  }
}

export default function PlateCard({
  plate,
  index = 0,
  forceVerified = false,
  hideSellerName = false,
}: PlateCardProps) {
  const router = useRouter();
  const delay = Math.min(index, 7) + 1;
  const isAuction = plate.listingType === "auction";
  const sellerName = plate.sellerName?.trim();
  const showVerified = forceVerified || plate.isVerified;
  const showSellerName = !hideSellerName && !!sellerName;

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`group w-full max-w-full min-w-0 bg-[var(--surface-container-lowest)] rounded-2xl border cursor-pointer relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up stagger-${delay}`}
      style={{ borderColor: "rgba(187,202,199,0.15)", boxShadow: "0 2px 10px rgba(25,28,29,0.06)" }}
    >
      {/* LIVE badge for auction cards */}
      {isAuction && (
        <div
          className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full px-1.5 py-0.5 sm:right-2.5 sm:top-2.5"
          style={{ background: "rgba(186,26,26,0.1)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--error)" }} />
          <span className="text-[9px] font-black uppercase" style={{ color: "var(--error)" }}>LIVE</span>
        </div>
      )}

      {/* Emirate Ribbon */}
      <div
        className={cn(
          "absolute left-3 top-0 z-10 flex h-8 w-6 items-end justify-center rounded-b-sm pb-1 text-[6px] font-black text-white sm:left-4 sm:h-9 sm:w-7 sm:text-[7px]",
          getEmirateAccent(plate.type)
        )}
      >
        <span
          className="leading-none"
          style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        >
          {plate.emirate.substring(0, 3).toUpperCase()}
        </span>
      </div>

      {/* Plate Preview */}
      <div className="flex min-h-[108px] flex-1 items-center justify-center px-3 pb-1 pt-5 sm:min-h-[130px] sm:p-5 sm:pt-6">
        <div className="origin-center scale-[0.88] sm:scale-100">
          <PlateViz
            code={plate.code}
            num={plate.num}
            emirate={plate.emirate}
            type={plate.type}
            size="sm"
          />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <BadgeCheck
              size={14}
              strokeWidth={showVerified ? 0 : 1.8}
              fill={showVerified ? "var(--primary-container)" : "none"}
              style={{ color: showVerified ? "var(--primary)" : "var(--outline)" }}
            />
            {showVerified && (
              <span className="text-[9px] font-black uppercase tracking-[0.18em] sm:tracking-widest" style={{ color: "var(--primary)" }}>
                Verified
              </span>
            )}
          </div>
          {showSellerName && (
            <span
              className="block max-w-full truncate text-[9px] font-bold uppercase tracking-[0.16em] sm:max-w-[58%] sm:text-right sm:tracking-widest"
              style={{ color: "var(--outline)" }}
              title={sellerName}
            >
              {sellerName}
            </span>
          )}
        </div>

        {!isAuction && (
          <>
            {plate.origPrice && (
              <p className="text-[10px] line-through" style={{ color: "var(--outline)" }}>
                {aed(plate.origPrice)}
              </p>
            )}
            <div className="flex items-end justify-between gap-2">
              <p className="min-w-0 text-[15px] font-black sm:text-base" style={{ color: "var(--primary)" }}>
                {aed(plate.price)}
              </p>
              <span className="shrink-0 text-[10px] font-bold" style={{ color: "var(--on-surface-variant)" }}>
                {plate.emirate} · {plate.num.length}d
              </span>
            </div>
          </>
        )}

        {isAuction && (
          <>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--outline)" }}>
              Current Bid
            </p>
            <div className="mt-0.5 flex items-end justify-between gap-2">
              <span className="min-w-0 text-[15px] font-black sm:text-base" style={{ color: "var(--primary)" }}>
                {aed(plate.currentBid ?? 0)}
              </span>
              {plate.auctionEndTime && (
                <div className="shrink-0">
                  <CountdownTimer endTime={toISOString(plate.auctionEndTime)} variant="pill" />
                </div>
              )}
            </div>
            <span className="text-[9px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>
              {plate.bidCount} bids
            </span>
          </>
        )}
      </div>
    </div>
  );
}
