"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { aed } from "@/lib/plates";
import type { Bid } from "@/types";

interface BidHistoryProps {
  bids: Bid[];
  totalCount: number;
  defaultExpanded?: boolean;
}

export default function BidHistory({
  bids,
  totalCount,
  defaultExpanded = false,
}: BidHistoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

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
              key={i}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom:
                  i < bids.length - 1
                    ? "1px solid rgba(187,202,199,0.08)"
                    : "none",
                background: bid.isLeading
                  ? "rgba(0,110,45,0.04)"
                  : "transparent",
              }}
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{
                  background: bid.isLeading
                    ? "rgba(0,110,45,0.15)"
                    : "var(--surface-container-low)",
                  color: bid.isLeading
                    ? "var(--tertiary)"
                    : "var(--on-surface-variant)",
                }}
              >
                {bid.bidderInitials}
              </div>

              {/* Name + time */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {bid.bidderAlias}
                  </span>
                  {bid.isLeading && (
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase flex-shrink-0"
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
                  {bid.time}
                </p>
              </div>

              {/* Amount */}
              <span
                className="text-sm font-black flex-shrink-0"
                style={{
                  color: bid.isLeading
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
