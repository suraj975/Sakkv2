"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ArrowLeft,
  Bell,
  Copy,
  Receipt,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";
import BottomNav from "@/components/layout/BottomNav";

const STEPS = [
  {
    l: "Payment Received",
    s: "Funds cleared and held in vault.",
    done: true,
  },
  {
    l: "Seller Notified",
    s: "Notification sent to owner of plate Dubai A 123.",
    done: true,
  },
  {
    l: "Transfer in Progress",
    s: "Ownership certificate verification underway at RTA.",
    active: true,
  },
  { l: "Verification", s: "Awaiting final administrative approval." },
  { l: "Ready to Collect", s: "Digital deed ready for release." },
];

export default function EscrowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlateById(id ?? "").then((p) => {
      setPlate(p);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div
        className="flex-1 p-6 space-y-4"
        style={{ background: "var(--surface)" }}
      >
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-64 rounded-2xl" />
        <SkeletonBlock className="h-24 rounded-2xl" />
      </div>
    );
  if (!plate)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">🔒</span>
        <h2
          className="text-xl font-black"
          style={{ color: "var(--on-surface)" }}
        >
          Escrow record not found
        </h2>
        <button
          onClick={() => router.push("/home")}
          className="px-6 py-2.5 rounded-2xl text-sm font-bold cursor-pointer border-none"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Go Home
        </button>
      </div>
    );

  const txRef = `MDM-${String(plate.id ?? id)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()}-2401`;

  return (
    <div
      className="flex-1 overflow-y-auto pb-24"
      style={{ background: "var(--surface)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(248,250,251,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ background: "var(--surface-container-low)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--on-surface)" }} />
        </button>
        <span
          className="text-[16px] font-bold"
          style={{ color: "var(--on-surface)" }}
        >
          Transaction Status
        </span>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ background: "var(--surface-container-low)" }}
        >
          <Bell size={18} style={{ color: "var(--on-surface-variant)" }} />
        </button>
      </div>

      <div className="p-4 lg:px-6 lg:max-w-2xl lg:mx-auto">
        {/* Funds secured banner */}
        <div
          className="rounded-2xl p-4 mb-4 flex gap-3 items-center"
          style={{ background: "rgba(0,106,102,0.08)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <ShieldCheck size={20} color="white" />
          </div>
          <div>
            <div
              className="text-[14px] font-bold mb-0.5"
              style={{ color: "var(--primary)" }}
            >
              Funds Secured in Escrow
            </div>
            <div
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Your payment is safe and protected until transfer is confirmed by
              authorities.
            </div>
          </div>
        </div>

        {/* Reference card */}
        <div
          className="rounded-2xl p-4 mb-4 flex items-center justify-between"
          style={{
            background: "var(--surface-container-lowest)",
            boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
          }}
        >
          <div>
            <div
              className="text-[10px] font-bold tracking-widest mb-1"
              style={{ color: "var(--on-surface-variant)" }}
            >
              REFERENCE NUMBER
            </div>
            <div
              className="text-[18px] font-bold font-mono"
              style={{ color: "var(--primary)" }}
            >
              {txRef}
            </div>
          </div>
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--surface-container-low)" }}
          >
            <Copy size={16} style={{ color: "var(--on-surface-variant)" }} />
          </button>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          {STEPS.map((step, i) => {
            const isDone = step.done;
            const isActive = step.active;
            const isLast = i === STEPS.length - 1;

            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDone
                        ? "var(--primary)"
                        : isActive
                          ? "var(--primary)"
                          : "var(--surface-container)",
                      border:
                        isDone || isActive
                          ? "none"
                          : "2px solid var(--outline-variant)",
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 size={16} color="white" />
                    ) : isActive ? (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: "var(--outline-variant)" }}
                      />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 my-1"
                      style={{
                        background: isDone
                          ? "var(--primary)"
                          : "var(--surface-container)",
                        minHeight: 24,
                      }}
                    />
                  )}
                </div>
                <div className={`pb-${isLast ? "0" : "4"} pt-1`}>
                  <div
                    className="text-[14px] font-semibold mb-0.5"
                    style={{
                      color: isActive
                        ? "var(--primary)"
                        : isDone
                          ? "var(--on-surface)"
                          : "var(--on-surface-variant)",
                    }}
                  >
                    {step.l}
                  </div>
                  <div
                    className="text-[12px] leading-relaxed"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {step.s}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning box */}
        <div
          className="rounded-2xl p-4 mb-5 flex gap-3 items-start"
          style={{ background: "#FFF8E7" }}
        >
          <AlertCircle
            size={18}
            style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }}
          />
          <div
            className="text-[12px] leading-relaxed"
            style={{ color: "#78450A" }}
          >
            <strong>Important:</strong> The seller has a{" "}
            <strong>48h limit</strong> to initiate the physical handover or
            digital transfer. If the limit expires, you may request a full
            refund immediately.
          </div>
        </div>

        {/* Action buttons */}
        <button
          className="w-full rounded-2xl py-4 text-[15px] font-semibold cursor-pointer border-none flex items-center justify-center gap-2"
          style={{
            background: "var(--surface-container-low)",
            color: "var(--on-surface)",
          }}
        >
          <Receipt size={18} style={{ color: "var(--on-surface-variant)" }} />
          View Receipt
        </button>

        <button
          onClick={() => router.push(`/plates/${id}/checkout/complete`)}
          className="w-full rounded-2xl py-3 text-[13px] cursor-pointer mt-3 border-none"
          style={{
            background: "var(--surface-container)",
            color: "var(--on-surface-variant)",
          }}
        >
          Simulate: Transfer Confirmed →
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
