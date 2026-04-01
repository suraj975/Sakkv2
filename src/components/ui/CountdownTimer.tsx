"use client";

import { useState, useEffect } from "react";
import { timeRemaining } from "@/lib/plates";

interface CountdownTimerProps {
  endTime: string;
  variant?: "pill" | "strip" | "boxes" | "inline";
}

const ZERO = { days: 0, hours: 0, mins: 0, secs: 0, total: 0 };

export default function CountdownTimer({
  endTime,
  variant = "pill",
}: CountdownTimerProps) {
  const [time, setTime] = useState(ZERO);

  useEffect(() => {
    // Set real value on client only (avoids SSR/client Date.now() mismatch)
    setTime(timeRemaining(endTime));
    const id = setInterval(() => setTime(timeRemaining(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const isUrgent = time.total > 0 && time.total < 60 * 60 * 1000;
  const ended = time.total <= 0;

  const pad = (n: number) => String(n).padStart(2, "0");

  // ── Pill variant: compact badge (used on PlateCard)
  if (variant === "pill") {
    const label = ended
      ? "Ended"
      : time.days > 0
        ? `${time.days}d ${time.hours}h`
        : time.hours > 0
          ? `${time.hours}h ${time.mins}m`
          : `${time.mins}m ${time.secs}s`;

    return (
      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
        style={{
          background: ended
            ? "rgba(186,26,26,0.12)"
            : isUrgent
              ? "rgba(186,26,26,0.12)"
              : "rgba(12,191,184,0.12)",
          color: ended
            ? "var(--error)"
            : isUrgent
              ? "var(--error)"
              : "var(--primary)",
        }}
      >
        {label}
      </span>
    );
  }

  // ── Strip variant: "02d : 14h : 35m" horizontal
  if (variant === "strip") {
    const parts = ended
      ? [
          { v: "00", l: "DAYS" },
          { v: "00", l: "HRS" },
          { v: "00", l: "MIN" },
        ]
      : [
          { v: pad(time.days), l: "DAYS" },
          { v: pad(time.hours), l: "HRS" },
          { v: pad(time.mins), l: "MIN" },
        ];
    return (
      <div className="flex items-center gap-1">
        {parts.map((p, i) => (
          <span key={i} className="flex items-baseline gap-0.5">
            {i > 0 && (
              <span
                className="text-xs font-bold mx-0.5"
                style={{ color: isUrgent ? "var(--error)" : "var(--primary)" }}
              >
                :
              </span>
            )}
            <span
              className="text-sm font-black tabular-nums"
              style={{ color: isUrgent ? "var(--error)" : "var(--on-surface)" }}
            >
              {p.v}
            </span>
            <span
              className="text-[8px] font-bold uppercase"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {p.l}
            </span>
          </span>
        ))}
      </div>
    );
  }

  // ── Inline variant: HH:MM:SS (for desktop bid page)
  if (variant === "inline") {
    const hh = pad(time.days * 24 + time.hours);
    const mm = pad(time.mins);
    const ss = pad(time.secs);
    return (
      <span
        className="font-black tabular-nums text-xl"
        style={{ color: isUrgent ? "var(--error)" : "var(--on-surface)" }}
      >
        {hh}:{mm}:{ss}
      </span>
    );
  }

  // ── Boxes variant: desktop detail page (large DAYS / HOURS / MINS boxes)
  if (variant === "boxes") {
    const boxes = ended
      ? [
          { v: "00", l: "DAYS" },
          { v: "00", l: "HOURS" },
          { v: "00", l: "MINS" },
        ]
      : [
          { v: pad(time.days), l: "DAYS" },
          { v: pad(time.hours), l: "HOURS" },
          { v: pad(time.mins), l: "MINS" },
        ];
    return (
      <div className="flex items-center gap-2">
        {boxes.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span
                className="text-xl font-black"
                style={{
                  color: isUrgent ? "#F87171" : "rgba(255,255,255,0.5)",
                }}
              >
                :
              </span>
            )}
            <div
              className="rounded-xl px-3 py-2 text-center min-w-[56px]"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <p
                className="text-2xl font-black tabular-nums leading-none"
                style={{ color: isUrgent ? "#F87171" : "white" }}
              >
                {b.v}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-70 text-white">
                {b.l}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
