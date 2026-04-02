"use client";

import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, Gift, Loader2, ShieldCheck } from "lucide-react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import { getPlateById } from "@/lib/firestore";
import { aed, escrowFee, priceTier } from "@/lib/plates";
import type { FSPlate } from "@/types/firebase";

function GiftCheckoutInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
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

  const recipientName = searchParams.get("name") || "Recipient";
  const message = searchParams.get("msg") || "";
  const fee = escrowFee(plate.price);
  const total = plate.price + fee;

  const handlePay = () => {
    const params = new URLSearchParams({
      plateId: String(plate.id ?? id),
      from: "Mohammed Al Hamdan",
      name: recipientName,
      msg: message,
    });
    router.push(`/gift/reveal?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--surface)]">
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-white px-4 shadow-[0_1px_0_rgba(187,202,199,0.18)]">
        <button
          onClick={() => router.push(`/plates/${id}/gift/setup?${searchParams.toString()}`)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-none bg-transparent text-[var(--primary)]"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-base font-black text-[var(--on-surface)]">Gift Checkout</span>
      </div>

      <div className="mx-auto max-w-md px-4 py-5 pb-8">
        <div
          className="rounded-[28px] px-5 py-6"
          style={{ background: "linear-gradient(180deg, #133D3A 0%, #152F2F 100%)" }}
        >
          <div className="flex justify-center">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="md"
            />
          </div>
          <p className="mt-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-white/60">
            Sending to {recipientName}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_36px_rgba(25,28,29,0.08)]">
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[var(--outline)]">Recipient</p>
            <p className="mt-2 text-[22px] font-black text-[var(--on-surface)]">{recipientName}</p>
            {message && <p className="mt-3 text-[15px] italic text-[var(--on-surface-variant)]">&ldquo;{message}&rdquo;</p>}
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_36px_rgba(25,28,29,0.08)]">
            <div className="flex items-center gap-4">
              <div className="scale-[0.92] origin-left">
                <PlateViz
                  code={plate.code}
                  num={plate.num}
                  emirate={plate.emirate}
                  type={plate.type}
                  size="sm"
                />
              </div>
              <div>
                <p className="text-[18px] font-black text-[var(--on-surface)]">
                  {plate.emirate} {plate.code} {plate.num}
                </p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">Sold by {plate.sellerName}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_36px_rgba(25,28,29,0.08)]">
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[var(--outline)]">Payment Breakdown</p>
            <div className="mt-4 space-y-3 text-[15px] text-[var(--on-surface-variant)]">
              <div className="flex items-center justify-between">
                <span>Plate Price</span>
                <span className="font-bold text-[var(--on-surface)]">{aed(plate.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service Fee · {priceTier(plate.price)}</span>
                <span className="font-bold text-[var(--on-surface)]">{aed(fee)}</span>
              </div>
            </div>
            <div className="my-4 h-px bg-[rgba(187,202,199,0.2)]" />
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-black text-[var(--on-surface)]">Total</span>
              <span className="text-[26px] font-black text-[var(--primary)]">{aed(total)}</span>
            </div>
          </div>

          <div
            className="rounded-[22px] px-4 py-4 text-[14px] leading-7"
            style={{ background: "#F3FBFB", border: "1px solid rgba(12,191,184,0.16)" }}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-1 shrink-0 text-[var(--primary)]" />
              <p className="text-[var(--on-surface-variant)]">
                Funds stay in Madmoon escrow until the recipient accepts the gift and the transfer is confirmed.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePay}
          className="mt-5 flex h-16 w-full items-center justify-center gap-3 rounded-[16px] border-none text-[18px] font-black text-white shadow-[0_12px_30px_rgba(0,106,102,0.22)]"
          style={{ background: "linear-gradient(90deg, #0E7F79 0%, #1CC6C3 100%)" }}
        >
          <Gift size={20} />
          Pay &amp; Send Gift
        </button>
      </div>
    </div>
  );
}

export default function GiftCheckoutPage() {
  return (
    <Suspense>
      <GiftCheckoutInner />
    </Suspense>
  );
}
