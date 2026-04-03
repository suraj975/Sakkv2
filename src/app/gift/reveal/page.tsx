"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";

function aed(n: number) {
  return "AED " + n.toLocaleString();
}

function GiftRevealInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const plateId = searchParams.get("plateId") || "3";
  const from = searchParams.get("from") || "Someone special";
  const gMsg = searchParams.get("msg") || "";

  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [loadingPlate, setLoadingPlate] = useState(true);
  const [tcf, setTcf] = useState("");

  useEffect(() => {
    getPlateById(plateId).then((p) => {
      setPlate(p);
      setLoadingPlate(false);
    });
  }, [plateId]);

  if (loadingPlate) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        style={{ background: "var(--surface)" }}
      >
        <Loader2 size={28} className="animate-spin text-[var(--outline)]" />
      </div>
    );
  }

  if (!plate) {
    return (
      <div className="p-8 text-center text-[var(--on-surface-variant)]">
        Gift not found.
      </div>
    );
  }

  const tcfValid = tcf.trim().length >= 6;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--surface)]">
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-white px-4 shadow-[0_1px_0_rgba(187,202,199,0.18)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-none bg-transparent text-[var(--primary)]"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-[18px] font-black tracking-[0.18em] text-[var(--primary)]">
            MADMOON
          </span>
        </div>
        <div className="rounded-full bg-[var(--teal-light)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">
          Gift
        </div>
      </div>

      <section
        className="px-6 pb-10 pt-8"
        style={{
          background: "linear-gradient(180deg, #133D3A 0%, #152F2F 100%)",
        }}
      >
        <div className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
            You received a gift
          </p>
          <h1 className="mt-3 text-[28px] font-black text-white">{from}</h1>
          <div className="mt-6 flex justify-center">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="lg"
            />
          </div>
          {gMsg && (
            <p className="mt-5 text-[15px] italic leading-7 text-white/70">
              &ldquo;{gMsg}&rdquo;
            </p>
          )}
        </div>
      </section>

      <div className="-mt-7 px-4 pb-8">
        <div className="mx-auto max-w-md space-y-5">
          <div className="rounded-[26px] bg-white p-6 shadow-[0_10px_36px_rgba(25,28,29,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Plate Value
                </p>
                <p className="mt-2 text-[30px] font-black leading-none text-[var(--primary)]">
                  {aed(plate.price)}
                </p>
              </div>
              <div
                className="mt-4 rounded-full px-4 py-2 text-sm font-black"
                style={{ background: "#E8F6EE", color: "#1B7D3C" }}
              >
                ↗ +2.4%
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-7 text-[var(--on-surface-variant)]">
              Enter your Traffic Code File number so Madmoon can complete the
              legal ownership transfer.
            </p>
          </div>

          <div className="rounded-[26px] bg-white p-6 shadow-[0_10px_36px_rgba(25,28,29,0.08)]">
            <label className="text-[12px] font-black uppercase tracking-[0.16em] text-[var(--outline)]">
              Traffic Code Number
            </label>
            <div className="relative mt-3">
              <input
                value={tcf}
                onChange={(e) => setTcf(e.target.value)}
                placeholder="7729103"
                className="w-full rounded-[18px] border-none bg-[var(--surface-container-low)] px-4 py-4 pr-12 text-[16px] text-[var(--on-surface)] outline-none placeholder:text-[var(--outline)]"
              />
              {tcfValid && (
                <div className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--primary)]">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
            </div>
            <p className="mt-3 text-[14px] leading-7 text-[var(--on-surface-variant)]">
              You can find your TCF on your registration documents or the MOI
              app.
            </p>
          </div>

          <div
            className="rounded-[22px] px-4 py-4 text-[14px] leading-7"
            style={{
              background: "#F3FBFB",
              border: "1px solid rgba(12,191,184,0.16)",
            }}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-1 shrink-0 text-[var(--primary)]"
              />
              <p className="text-[var(--on-surface-variant)]">
                Madmoon escrow protects both sides until the transfer is
                approved and completed.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/plates/${plate.id}/checkout/complete`)}
            disabled={!tcfValid}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-[16px] border-none text-[18px] font-black text-white"
            style={{
              background: tcfValid
                ? "linear-gradient(90deg, #0E7F79 0%, #1CC6C3 100%)"
                : "linear-gradient(90deg, #A9D7D5 0%, #CBE9E7 100%)",
              cursor: tcfValid ? "pointer" : "not-allowed",
            }}
          >
            <Gift size={20} />
            Accept Gift &amp; Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GiftRevealPage() {
  return (
    <Suspense>
      <GiftRevealInner />
    </Suspense>
  );
}
