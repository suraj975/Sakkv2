"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Gift, Loader2, Sparkles, Star } from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import { getPlateById } from "@/lib/firestore";
import { aed } from "@/lib/plates";
import type { FSPlate } from "@/types/firebase";

export default function GiftDetailPage() {
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center" style={{ color: "var(--outline)" }}>
        <Loader2 size={26} className="animate-spin" />
      </div>
    );
  }

  if (!plate) return notFound();

  const sellerName = plate.sellerName?.trim() || "Premier Seller";

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--surface)]">
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-white px-4 shadow-[0_1px_0_rgba(187,202,199,0.18)] lg:px-8 lg:h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-none bg-transparent text-[var(--primary)]"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-[18px] font-black tracking-[0.18em] text-[var(--primary)]">
            SAKK
          </span>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border"
          style={{ borderColor: "rgba(0,106,102,0.15)", background: "var(--teal-light)" }}
        >
          <span className="text-xs font-black text-[var(--primary)]">
            {sellerName.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>

      <section
        className="px-6 pb-10 pt-8"
        style={{ background: "linear-gradient(180deg, #133D3A 0%, #152F2F 100%)" }}
      >
        <div className="mx-auto max-w-md">
          <div className="mb-5 flex justify-center">
            <div className="max-w-full scale-[1.04] origin-top">
              <PlateViz
                code={plate.code}
                num={plate.num}
                emirate={plate.emirate}
                type={plate.type}
                size="lg"
              />
            </div>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
            Private Sale
          </p>
          <h1 className="mt-1 text-[34px] font-black leading-none tracking-tight text-white">
            {plate.emirate} {plate.code} {plate.num}
          </h1>
        </div>
      </section>

      <div className="-mt-7 px-4 pb-8">
        <div className="mx-auto max-w-md space-y-5">
          <div
            className="rounded-[26px] bg-white p-6 shadow-[0_10px_36px_rgba(25,28,29,0.08)]"
            style={{ border: "1px solid rgba(187,202,199,0.12)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--on-surface-variant)]">Current Value</p>
                <p className="mt-2 text-[30px] font-black leading-none text-[var(--primary)]">
                  {aed(plate.price)}
                </p>
              </div>
              <div
                className="mt-4 rounded-full px-4 py-2 text-sm font-black"
                style={{ background: "#E8F6EE", color: "#1B7D3C" }}
              >
                ↗ +4.2%
              </div>
            </div>

            <div className="my-6 h-px bg-[rgba(187,202,199,0.2)]" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full"
                  style={{ background: "linear-gradient(135deg, #0B7A76 0%, #064845 100%)" }}
                >
                  <span className="text-lg font-black text-white">
                    {sellerName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-[18px] font-black text-[var(--on-surface)]">{sellerName}</p>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {plate.isVerified ? "Verified Premier Seller" : "Trusted Seller"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--on-surface)]">
                <Star size={18} fill="currentColor" />
                <span className="text-[18px] font-black">4.9</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-[24px] px-6 py-7"
            style={{
              background: "#F1F9FB",
              border: "1px solid rgba(12,191,184,0.16)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #14C7C2 0%, #0B9A96 100%)" }}
              >
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-[var(--on-surface)]">The Digital Reveal</h2>
                <p className="mt-2 text-[15px] leading-8 text-[var(--on-surface-variant)]">
                  A unique gifting experience. Upon purchase, the recipient receives a curated
                  digital invitation to &quot;reveal&quot; their new asset in a cinematic virtual gallery.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/plates/${id}/gift/setup`)}
            className="flex h-[72px] w-full items-center justify-center gap-3 rounded-[16px] border-none text-[18px] font-black text-white shadow-[0_12px_30px_rgba(0,106,102,0.22)]"
            style={{ background: "linear-gradient(90deg, #0E7F79 0%, #1CC6C3 100%)" }}
          >
            <Gift size={22} />
            Gift this Plate
          </button>

          <button
            onClick={() => router.push(`/plates/${id}/checkout`)}
            className="h-[72px] w-full rounded-[16px] border-none bg-[#EEF0F1] text-[18px] font-black text-[var(--primary)]"
          >
            Buy for Myself Instead
          </button>

          <p className="pt-4 text-center text-[11px] font-black uppercase tracking-[0.22em] text-[var(--outline)]">
            Transaction secured by Madmoon Escrow
          </p>
        </div>
      </div>
    </div>
  );
}
