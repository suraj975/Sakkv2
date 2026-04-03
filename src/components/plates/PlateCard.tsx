"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import PlateViz from "./PlateViz";
import { aed } from "@/lib/plates";
import { toISOString } from "@/lib/utils";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { FSPlate } from "@/types/firebase";

interface PlateCardProps {
  plate: FSPlate;
  index?: number;
  forceVerified?: boolean;
  hideSellerName?: boolean;
}

export default function PlateCard({
  plate,
  index = 0,
  forceVerified: _forceVerified = false,
  hideSellerName: _hideSellerName = false,
}: PlateCardProps) {
  const router = useRouter();
  const delay = Math.min(index, 7) + 1;
  const isAuction = plate.listingType === "auction";

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`group w-full max-w-full min-w-0 rounded-2xl cursor-pointer relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-up stagger-${delay}`}
      style={{
        background: "var(--surface-container-lowest)",
        border: "1px solid rgba(187,202,199,0.2)",
        boxShadow: "0 2px 10px rgba(25,28,29,0.06)",
      }}
    >
      {/* Plate area */}
      <div
        className="flex flex-col px-3 py-2.5 sm:px-4 sm:py-5"
        style={{ background: "var(--primary)" }}
      >
        {isAuction && (
          <div className="flex justify-end mb-1.5">
            <div
              className="flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
              <span className="text-[9px] font-black uppercase text-white">
                LIVE
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center">
          <div className="sm:hidden">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="sm"
            />
          </div>
          <div className="hidden sm:block">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 sm:px-4 sm:py-3.5" style={{ background: "var(--surface-container-low)" }}>
        {!isAuction && (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              {plate.origPrice && (
                <p
                  className="text-[10px] line-through leading-none mb-1"
                  style={{ color: "var(--outline)" }}
                >
                  {aed(plate.origPrice)}
                </p>
              )}
              <p
                className="text-[15px] font-black sm:text-base leading-none"
                style={{ color: "var(--on-surface)" }}
              >
                {aed(plate.price)}
              </p>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ background: "rgba(12,191,184,0.12)" }}
            >
              <Zap
                size={15}
                fill="var(--primary-container)"
                style={{ color: "var(--primary-container)" }}
              />
            </button>
          </div>
        )}

        {isAuction && (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p
                className="text-[9px] font-bold uppercase tracking-wider leading-none mb-1"
                style={{ color: "var(--outline)" }}
              >
                Current Bid
              </p>
              <p
                className="text-[15px] font-black sm:text-base leading-none"
                style={{ color: "var(--on-surface)" }}
              >
                {aed(plate.currentBid ?? 0)}
              </p>
              <span
                className="text-[9px] font-semibold mt-0.5 block"
                style={{ color: "var(--outline)" }}
              >
                {plate.bidCount} bids
              </span>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              {plate.auctionEndTime && (
                <CountdownTimer
                  endTime={toISOString(plate.auctionEndTime)}
                  variant="pill"
                />
              )}
              <button
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ background: "rgba(12,191,184,0.12)" }}
              >
                <Zap
                  size={15}
                  fill="var(--primary-container)"
                  style={{ color: "var(--primary-container)" }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
