"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle2, Download, Home } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import PlateViz from "@/components/plates/PlateViz";
import { aed } from "@/lib/plates";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";

export default function CompletePage() {
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
        <SkeletonBlock className="h-20 w-20 rounded-full mx-auto" />
        <SkeletonBlock className="h-8 w-56 mx-auto" />
        <SkeletonBlock className="h-32 rounded-2xl" />
      </div>
    );
  if (!plate)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">✅</span>
        <h2
          className="text-xl font-black"
          style={{ color: "var(--on-surface)" }}
        >
          Transaction not found
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

  const txRef = `SKK-2024-50124`;

  return (
    <div
      className="flex-1 flex flex-col items-center px-5 py-8 overflow-y-auto"
      style={{ background: "var(--surface)" }}
    >
      {/* Check icon */}
      <div className="relative mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "var(--primary)" }}
        >
          <CheckCircle2 size={40} strokeWidth={2} color="white" />
        </div>
        <div
          className="absolute inset-0 rounded-full -m-2"
          style={{ border: "3px solid rgba(0,106,102,0.2)" }}
        />
      </div>

      {/* Title */}
      <h1
        className="text-[26px] font-black mb-2 text-center"
        style={{ color: "var(--on-surface)" }}
      >
        Transfer Confirmed!
      </h1>
      <p
        className="text-[14px] text-center mb-3"
        style={{ color: "var(--on-surface-variant)" }}
      >
        Plate {plate.code} {plate.num} has been officially transferred to your
        name.
      </p>

      {/* Ref chip */}
      <div
        className="rounded-full px-4 py-1.5 mb-6 text-[12px] font-mono font-semibold"
        style={{
          background: "var(--surface-container-low)",
          color: "var(--on-surface-variant)",
        }}
      >
        REF: {txRef}
      </div>

      {/* Plate viz card */}
      <div
        className="rounded-2xl p-5 mb-4 w-full max-w-md"
        style={{
          background: "var(--surface-container-lowest)",
          boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
        }}
      >
        <div className="flex justify-center mb-3">
          <PlateViz
            code={plate.code}
            num={plate.num}
            emirate={plate.emirate}
            type={plate.type}
            size="md"
          />
        </div>
        <div className="flex justify-between">
          <span
            className="text-[10px] font-bold tracking-widest"
            style={{ color: "var(--on-surface-variant)" }}
          >
            OWNERSHIP VERIFIED
          </span>
          <span
            className="text-[10px] font-bold tracking-widest"
            style={{ color: "var(--on-surface-variant)" }}
          >
            DIGITAL TITLE ISSUED
          </span>
        </div>
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl p-4 mb-4 w-full max-w-md"
        style={{
          background: "var(--surface-container-lowest)",
          boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
        }}
      >
        <div className="flex justify-between items-center py-2">
          <span
            className="text-[14px]"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Plate value paid
          </span>
          <span
            className="text-[14px] font-semibold"
            style={{ color: "var(--on-surface)" }}
          >
            {aed(plate.price)}
          </span>
        </div>
        <div
          className="flex justify-between items-center py-2"
          style={{ borderTop: "1px solid var(--surface-container)" }}
        >
          <span
            className="text-[14px]"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Funds released to seller
          </span>
          <span
            className="text-[14px] font-bold"
            style={{ color: "var(--primary)" }}
          >
            {aed(plate.price)}
          </span>
        </div>
      </div>

      {/* What's next */}
      <div
        className="rounded-2xl p-4 mb-6 w-full max-w-md"
        style={{ background: "rgba(0,106,102,0.08)" }}
      >
        <div
          className="text-[10px] font-bold tracking-widest mb-2"
          style={{ color: "var(--primary)" }}
        >
          WHAT&apos;S NEXT?
        </div>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--on-surface-variant)" }}
        >
          Visit RTA registration centre with Emirates ID to collect plate. Bring
          reference{" "}
          <span
            className="font-mono font-bold"
            style={{ color: "var(--on-surface)" }}
          >
            {txRef}
          </span>
          .
        </p>
      </div>

      {/* CTAs */}
      <button
        onClick={() => router.push("/")}
        className="w-full max-w-md border-none rounded-2xl py-4 text-[16px] font-bold text-white cursor-pointer mb-3 flex items-center justify-center gap-2"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
          boxShadow: "0 4px 16px rgba(0,106,102,0.35)",
        }}
      >
        <Home size={18} />
        Back to Home
      </button>
      <button
        className="w-full max-w-md rounded-2xl py-4 text-[15px] font-semibold cursor-pointer border-none flex items-center justify-center gap-2"
        style={{
          background: "var(--surface-container-low)",
          color: "var(--on-surface)",
        }}
      >
        <Download size={18} style={{ color: "var(--on-surface-variant)" }} />
        Download Receipt
      </button>

      <p
        className="text-[11px] mt-5 text-center"
        style={{ color: "var(--on-surface-variant)", opacity: 0.6 }}
      >
        A confirmation email has been sent to your registered address.
      </p>
    </div>
  );
}
