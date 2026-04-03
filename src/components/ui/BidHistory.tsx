"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { aed } from "@/lib/plates";
import type { FSBid } from "@/types/firebase";

interface BidHistoryProps {
  bids: FSBid[];
  totalCount: number;
  defaultExpanded?: boolean;
}

export default function BidHistory({
  bids,
  totalCount,
  defaultExpanded = false,
}: BidHistoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const relativeTime = (bid: FSBid): string => {
    if (!bid.createdAt) return "";
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - bid.createdAt.toDate().getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface-container-lowest)",
        border: "1px solid rgba(187,202,199,0.12)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 cursor-pointer bg-transparent border-none text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold" style={{ color: "var(--on-surface)" }}>
            Bid History
          </span>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(12,191,184,0.12)",
              color: "var(--primary)",
            }}
          >
            {totalCount} Bids
          </span>
        </div>
        {expanded ? (
          <ChevronUp
            size={16}
            strokeWidth={2}
            style={{ color: "var(--on-surface-variant)" }}
          />
        ) : (
          <ChevronDown
            size={16}
            strokeWidth={2}
            style={{ color: "var(--on-surface-variant)" }}
          />
        )}
      </button>

      {/* Bid rows */}
      {expanded && (
        <div
          className="border-t"
          style={{ borderColor: "rgba(187,202,199,0.12)" }}
        >
          {bids.map((bid, i) => (
            <div
              key={bid.id ?? i}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom:
                  i < bids.length - 1
                    ? "1px solid rgba(187,202,199,0.08)"
                    : "none",
                background: bid.isWinning
                  ? "rgba(0,110,45,0.04)"
                  : "transparent",
              }}
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                style={{
                  background: bid.isWinning
                    ? "rgba(0,110,45,0.15)"
                    : "var(--surface-container-low)",
                  color: bid.isWinning
                    ? "var(--tertiary)"
                    : "var(--on-surface-variant)",
                }}
              >
                {bid.bidderName.slice(0, 2).toUpperCase()}
              </div>

              {/* Name + time */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {bid.bidderName}
                  </span>
                  {bid.isWinning && (
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shrink-0"
                      style={{
                        background: "rgba(0,110,45,0.15)",
                        color: "var(--tertiary)",
                      }}
                    >
                      LEADING
                    </span>
                  )}
                </div>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--outline)" }}
                >
                  {relativeTime(bid)}
                </p>
              </div>

              {/* Amount */}
              <span
                className="text-sm font-black shrink-0"
                style={{
                  color: bid.isWinning
                    ? "var(--tertiary)"
                    : "var(--on-surface)",
                }}
              >
                {aed(bid.amount)}
              </span>
            </div>
          ))}

          {totalCount > bids.length && (
            <div className="px-4 py-3 text-center">
              <span
                className="text-sm font-semibold cursor-pointer"
                style={{ color: "var(--primary)" }}
              >
                View All {totalCount} Bids
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
