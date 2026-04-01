"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import PlateViz from "./PlateViz";
import { aed } from "@/lib/plates";
import { cn } from "@/lib/utils";
import type { Plate } from "@/types";

interface PlateCardProps {
  plate: Plate;
  index?: number;
}

function getEmirateAccent(type: Plate["type"]) {
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

  return (
    <div
      onClick={() => router.push(`/plates/${plate.id}`)}
      className={`group bg-[var(--surface-container-lowest)] rounded-2xl border cursor-pointer relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up stagger-${delay}`}
      style={{ borderColor: "rgba(187,202,199,0.15)", boxShadow: "0 2px 10px rgba(25,28,29,0.06)" }}
    >
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
              strokeWidth={plate.verified ? 0 : 1.8}
              fill={plate.verified ? "var(--primary-container)" : "none"}
              style={{ color: plate.verified ? "var(--primary)" : "var(--outline)" }}
            />
            {plate.verified && (
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                Verified
              </span>
            )}
          </div>
          {plate.days && (
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--outline)" }}>
              {plate.days}d ago
            </span>
          )}
        </div>

        {plate.orig && (
          <p className="text-[10px] line-through" style={{ color: "var(--outline)" }}>
            {aed(plate.orig)}
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
      </div>
    </div>
  );
}
