"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import PlateViz from "./PlateViz";
import { aed } from "@/lib/plates";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { Plate } from "@/types";

interface PlateCardProps {
  plate: Plate;
  index?: number;
}

export default function PlateCard({ plate, index = 0 }: PlateCardProps) {
  const router = useRouter();
  const delay = Math.min(index, 7) + 1;
  const isAuction = plate.listingType === "auction";

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`plate-card rounded-2xl p-3 animate-fade-up stagger-${delay} relative overflow-hidden`}
      style={{
        background: "var(--surface-container-lowest)",
        border: "1px solid rgba(187,202,199,0.1)",
        boxShadow: "0 2px 10px rgba(25,28,29,0.06)",
      }}
    >
      {/* LIVE badge for auction cards */}
      {isAuction && (
        <div
          className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(186,26,26,0.1)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--error)" }}
          />
          <span
            className="text-[9px] font-black uppercase"
            style={{ color: "var(--error)" }}
          >
            LIVE
          </span>
        </div>
      )}

      <div className="flex justify-center mb-3">
        <PlateViz
          code={plate.code}
          num={plate.num}
          emirate={plate.emirate}
          type={plate.type}
          size="sm"
        />
      </div>

      {/* Fixed listing display */}
      {!isAuction && (
        <>
          {plate.orig && (
            <div
              className="text-[10px] text-center line-through"
              style={{ color: "var(--outline)" }}
            >
              {aed(plate.orig)}
            </div>
          )}
          <div className="flex justify-between items-start mt-1">
            <div>
              <p
                className="text-[10px] font-medium"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {plate.emirate} · {plate.num.length} Digit
                {plate.num.length !== 1 ? "s" : ""}
              </p>
              <span
                className="text-sm font-black"
                style={{ color: "var(--primary)" }}
              >
                {aed(plate.price)}
              </span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer bg-transparent border-none p-0.5 mt-0.5"
            >
              <BadgeCheck
                size={15}
                strokeWidth={plate.verified ? 0 : 1.8}
                fill={plate.verified ? "var(--primary-container)" : "none"}
                style={{
                  color: plate.verified ? "var(--primary)" : "var(--outline)",
                }}
              />
            </button>
          </div>
          {plate.days && (
            <p
              className="text-[9px] mt-0.5"
              style={{ color: "var(--outline)" }}
            >
              {plate.days} day{plate.days !== 1 ? "s" : ""} ago
            </p>
          )}
        </>
      )}

      {/* Auction listing display */}
      {isAuction && (
        <>
          <div className="mt-1">
            <p
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: "var(--outline)" }}
            >
              Current Bid
            </p>
            <span
              className="text-sm font-black"
              style={{ color: "var(--primary)" }}
            >
              {aed(plate.currentBid ?? 0)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            {plate.auctionEndTime && (
              <CountdownTimer endTime={plate.auctionEndTime} variant="pill" />
            )}
            <span
              className="text-[9px] font-semibold"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {plate.bidCount} bids ›
            </span>
          </div>
        </>
      )}
    </div>
  );
}
