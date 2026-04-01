"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useState } from "react";
import PlateViz from "@/components/plates/PlateViz";
import { ArrowLeft, Lock, Building2, CreditCard, Smartphone, ShieldCheck } from "lucide-react";
import { getPlateById, aed, escrowFee } from "@/lib/plates";

const PAYMENT_METHODS = [
  {
    id: "bank",
    label: "Bank Transfer",
    sub: "Instant verification via UAE Central Bank",
    Icon: Building2,
  },
  {
    id: "card",
    label: "Credit Card",
    sub: "Visa, Mastercard, Amex",
    Icon: CreditCard,
  },
  {
    id: "apple",
    label: "Apple Pay",
    sub: "Secure one-tap payment",
    Icon: Smartphone,
  },
];

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const plate = getPlateById(id);

  if (!plate) return notFound();

  const fee = escrowFee(plate.price);
  const total = plate.price + fee;
  const [payMethod, setPayMethod] = useState("bank");

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "var(--surface)" }}>
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
        <span className="text-[15px] font-bold" style={{ color: "var(--primary)" }}>
          The Curated Exchange
        </span>
        <Lock size={18} style={{ color: "var(--on-surface-variant)" }} />
      </div>

      <div className="px-4 pt-6 pb-32 lg:px-8 lg:max-w-5xl lg:mx-auto lg:pb-10">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-[28px] font-black leading-tight mb-2" style={{ color: "var(--on-surface)" }}>
            Finalize Your<br />Acquisition
          </h1>
          <p className="text-[14px]" style={{ color: "var(--on-surface-variant)" }}>
            Complete your secure transaction through Sakk Escrow.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Left column */}
          <div>
            {/* Plate card */}
            <div
              className="rounded-2xl p-5 mb-4 flex flex-col items-center"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
              }}
            >
              <PlateViz
                code={plate.code}
                num={plate.num}
                emirate={plate.emirate}
                type={plate.type}
                size="md"
              />
              <div className="flex items-center justify-between w-full mt-3">
                <span className="text-[14px] font-semibold" style={{ color: "var(--on-surface)" }}>
                  {plate.emirate} {plate.code} {plate.num}
                </span>
                <span className="text-[10px] font-bold tracking-wider" style={{ color: "var(--primary)" }}>
                  VERIFIED ASSET
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
              }}
            >
              <div className="text-[10px] font-bold tracking-widest mb-4" style={{ color: "var(--on-surface-variant)" }}>
                FINANCIAL SUMMARY
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[14px]" style={{ color: "var(--on-surface-variant)" }}>Plate Price</span>
                <span className="text-[14px] font-semibold" style={{ color: "var(--on-surface)" }}>{aed(plate.price)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px]" style={{ color: "var(--on-surface-variant)" }}>Escrow Fee</span>
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ background: "var(--primary-container)" }}
                  >i</div>
                </div>
                <span className="text-[14px]" style={{ color: "var(--on-surface-variant)" }}>{aed(fee)}</span>
              </div>
              <div
                className="flex justify-between items-center pt-3"
                style={{ borderTop: "1px solid var(--surface-container)" }}
              >
                <span className="text-[16px] font-bold" style={{ color: "var(--on-surface)" }}>Total Payable</span>
                <span className="text-[22px] font-black" style={{ color: "var(--primary)" }}>{aed(total)}</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Payment methods */}
            <div className="mb-4">
              <div className="text-[10px] font-bold tracking-widest mb-3" style={{ color: "var(--on-surface-variant)" }}>
                SELECT PAYMENT METHOD
              </div>
              {PAYMENT_METHODS.map((m) => {
                const selected = payMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2.5 cursor-pointer text-left border-none"
                    style={{
                      background: "var(--surface-container-lowest)",
                      outline: selected ? `2px solid var(--primary)` : "2px solid transparent",
                      outlineOffset: "1px",
                      boxShadow: "0 2px 10px rgba(25,28,29,0.06)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: selected ? "var(--primary)" : "var(--surface-container-low)" }}
                    >
                      <m.Icon size={18} color={selected ? "#fff" : "var(--on-surface-variant)"} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold" style={{ color: "var(--on-surface)" }}>{m.label}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: "var(--on-surface-variant)" }}>{m.sub}</div>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: selected ? "var(--primary)" : "var(--outline-variant)",
                        background: selected ? "var(--primary)" : "transparent",
                      }}
                    >
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Escrow protection */}
            <div
              className="rounded-2xl p-4 mb-5 flex gap-3 items-start"
              style={{ background: "var(--surface-container-low)" }}
            >
              <ShieldCheck size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--on-surface)" }}>
                  Protected by Sakk Escrow
                </div>
                <div className="text-[12px] leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  Your funds are held in a secure vault and only released to the seller once the plate transfer is confirmed by the RTA.
                </div>
              </div>
            </div>

            {/* Desktop CTA */}
            <button
              onClick={() => router.push(`/plates/${id}/checkout/escrow`)}
              className="hidden lg:block w-full border-none rounded-2xl py-4 text-[16px] font-bold text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                boxShadow: "0 4px 16px rgba(0,106,102,0.35)",
              }}
            >
              Pay {aed(total)} — Secure in Escrow
            </button>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 lg:hidden"
        style={{ background: "rgba(248,250,251,0.95)", backdropFilter: "blur(10px)" }}
      >
        <button
          onClick={() => router.push(`/plates/${id}/checkout/escrow`)}
          className="w-full border-none rounded-2xl py-4 text-[16px] font-bold text-white cursor-pointer"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
            boxShadow: "0 4px 16px rgba(0,106,102,0.35)",
          }}
        >
          Pay {aed(total)} — Secure in Escrow
        </button>
      </div>
    </div>
  );
}
