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

export default function PlateCard({ plate, index = 0 }: PlateCardProps) {
  const router = useRouter();
  const delay = Math.min(index, 7) + 1;
  const isAuction = plate.listingType === "auction";

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`group bg-[var(--surface-container-lowest)] rounded-2xl border cursor-pointer relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up stagger-${delay}`}
      style={{ borderColor: "rgba(187,202,199,0.15)", boxShadow: "0 2px 10px rgba(25,28,29,0.06)" }}
    >
      {/* LIVE badge for auction cards */}
      {isAuction && (
        <div
          className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(186,26,26,0.1)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--error)" }} />
          <span className="text-[9px] font-black uppercase" style={{ color: "var(--error)" }}>LIVE</span>
        </div>
      )}

      {/* Emirate Ribbon */}
      <div
        className={cn(
          "absolute top-0 left-4 w-7 h-9 flex items-end justify-center pb-1 text-[7px] font-black text-white rounded-b-sm z-10",
          getEmirateAccent(plate.type)
        )}
      >
        <span className="-rotate-90 whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          {plate.emirate.substring(0, 3).toUpperCase()}
        </span>
      </div>

      {/* Plate Preview */}
      <div className="p-5 pt-6 flex-1 flex items-center justify-center min-h-[130px]">
        <PlateViz
          code={plate.code}
          num={plate.num}
          emirate={plate.emirate}
          type={plate.type}
          size="sm"
        />
      </div>

      {/* Info */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BadgeCheck
              size={14}
              strokeWidth={plate.isVerified ? 0 : 1.8}
              fill={plate.isVerified ? "var(--primary-container)" : "none"}
              style={{ color: plate.isVerified ? "var(--primary)" : "var(--outline)" }}
            />
            {plate.isVerified && (
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                Verified
              </span>
            )}
          </div>
          {plate.sellerName && (
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--outline)" }}>
              {plate.sellerName}
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
            <div className="flex items-center justify-between">
              <p className="text-base font-black" style={{ color: "var(--primary)" }}>
                {aed(plate.price)}
              </p>
              <span className="text-[10px] font-bold" style={{ color: "var(--on-surface-variant)" }}>
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
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-base font-black" style={{ color: "var(--primary)" }}>
                {aed(plate.currentBid ?? 0)}
              </span>
              {plate.auctionEndTime && (
                <CountdownTimer endTime={toISOString(plate.auctionEndTime)} variant="pill" />
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
