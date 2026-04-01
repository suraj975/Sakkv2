"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { Hammer, CheckCircle, ArrowLeft, Clock } from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import { getPlateById, aed, escrowFee } from "@/lib/plates";

export default function AuctionWonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const plate = getPlateById(id);

  if (!plate || plate.listingType !== "auction") return notFound();

  const winningBid = plate.currentBid ?? plate.price;
  const fee = escrowFee(winningBid);
  const total = winningBid + fee;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── Mobile Header ── */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center h-14 px-4 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.push("/auctions")}
          className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none"
          style={{ color: "var(--on-surface)" }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span
          className="font-bold text-base ml-2"
          style={{ color: "var(--on-surface)" }}
        >
          Auction Won
        </span>
      </header>

      {/* ── Desktop Header ── */}
      <header
        className="hidden lg:flex sticky top-0 z-40 items-center h-16 px-8 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.push("/auctions")}
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft size={16} /> Back to Auctions
        </button>
      </header>

      {/* ══════════════════════ MOBILE ══════════════════════ */}
      <div className="lg:hidden pb-28 px-4 pt-8">
        {/* Trophy icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "rgba(12,191,184,0.15)" }}
          >
            <Hammer
              size={36}
              strokeWidth={1.5}
              style={{ color: "var(--primary)" }}
            />
            <div
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--tertiary)" }}
            >
              <CheckCircle
                size={14}
                strokeWidth={2.5}
                style={{ color: "white" }}
              />
            </div>
          </div>
          <h1
            className="text-2xl font-black mb-2"
            style={{ color: "var(--on-surface)" }}
          >
            You Won the Auction!
          </h1>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "var(--on-surface-variant)" }}
          >
            You won plate {plate.emirate} {plate.code} {plate.num} with a bid of{" "}
            {aed(winningBid)}
          </p>
        </div>

        {/* Plate card with yellow accent */}
        <div
          className="rounded-2xl overflow-hidden mb-4 flex"
          style={{
            background: "var(--surface-container-lowest)",
            border: "1px solid rgba(187,202,199,0.12)",
          }}
        >
          <div
            className="w-2.5 flex-shrink-0"
            style={{
              background: "linear-gradient(to bottom, #F59E0B, #D97706)",
            }}
          />
          <div className="flex-1 p-5 flex items-center gap-4">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="md"
            />
            <div>
              <p
                className="text-[9px] font-black uppercase tracking-wider mb-1"
                style={{ color: "var(--amber)" }}
              >
                {plate.emirate.toUpperCase()} {plate.code}
              </p>
              <p
                className="text-xl font-black"
                style={{ color: "var(--on-surface)" }}
              >
                {plate.num}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--primary)" }}>
                {aed(winningBid)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment deadline */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3 mb-4"
          style={{
            background: "rgba(217,119,6,0.08)",
            border: "1px solid rgba(217,119,6,0.2)",
          }}
        >
          <Clock
            size={18}
            strokeWidth={1.8}
            className="flex-shrink-0 mt-0.5"
            style={{ color: "var(--amber)" }}
          />
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--amber)" }}>
              Complete payment within 24 hours
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#92400E" }}>
              23h 41m remaining — Failure to pay may forfeit your win
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: "var(--surface-container-low)" }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-[2px] mb-4"
            style={{ color: "var(--outline)" }}
          >
            Payment Summary
          </p>
          {[
            { label: "Winning bid", value: aed(winningBid) },
            { label: "Escrow Fee", value: aed(fee) },
          ].map((row, i) => (
            <div
              key={i}
              className="flex justify-between py-2.5 border-b"
              style={{ borderColor: "rgba(187,202,199,0.2)" }}
            >
              <span
                className="text-sm"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {row.label}
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--on-surface)" }}
              >
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-2.5 mt-1">
            <span className="font-bold" style={{ color: "var(--on-surface)" }}>
              Total Payable
            </span>
            <span
              className="font-black text-lg"
              style={{ color: "var(--primary)" }}
            >
              {aed(total)}
            </span>
          </div>
        </div>

        {/* Proceed to Payment */}
        <button
          onClick={() => router.push(`/plates/${plate.id}/checkout`)}
          className="w-full h-14 rounded-xl font-bold flex items-center justify-center cursor-pointer border-none text-white mb-4"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
          }}
        >
          Proceed to Payment — {aed(total)}
        </button>

        <button
          className="w-full text-center font-semibold text-sm cursor-pointer bg-transparent border-none"
          style={{ color: "var(--primary)" }}
        >
          Decline Win
        </button>

        <p
          className="text-[10px] text-center mt-4 leading-relaxed"
          style={{ color: "var(--outline)" }}
        >
          By proceeding, you agree to complete the purchase and initiate the RTA
          transfer process. Sakk escrow protects both parties throughout.
        </p>
      </div>

      {/* ══════════════════════ DESKTOP ══════════════════════ */}
      <div className="hidden lg:block max-w-[900px] mx-auto px-8 pt-12 pb-12">
        {/* Trophy + title */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(12,191,184,0.12)",
                  border: "2px solid rgba(12,191,184,0.25)",
                }}
              >
                <Hammer
                  size={44}
                  strokeWidth={1.3}
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <div
                className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "var(--tertiary)" }}
              >
                <CheckCircle
                  size={18}
                  strokeWidth={2.5}
                  style={{ color: "white" }}
                />
              </div>
            </div>
          </div>
          <h1
            className="text-4xl font-black mb-3"
            style={{ color: "var(--on-surface)" }}
          >
            You Won the Auction!
          </h1>
          <p className="text-lg" style={{ color: "var(--on-surface-variant)" }}>
            You won plate {plate.emirate} {plate.code} {plate.num} with a bid of{" "}
            {aed(winningBid)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Left: Plate card */}
          <div>
            <div
              className="rounded-3xl overflow-hidden flex"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
              }}
            >
              <div
                className="w-3 flex-shrink-0"
                style={{
                  background: "linear-gradient(to bottom, #F59E0B, #D97706)",
                }}
              />
              <div className="flex-1 p-8 flex flex-col items-center justify-center gap-5">
                <PlateViz
                  code={plate.code}
                  num={plate.num}
                  emirate={plate.emirate}
                  type={plate.type}
                  size="lg"
                />
                <div className="text-center">
                  <p
                    className="text-[10px] font-black uppercase tracking-[2px] mb-1"
                    style={{ color: "var(--amber)" }}
                  >
                    {plate.emirate.toUpperCase()} · SERIES {plate.code}
                  </p>
                  <p
                    className="text-2xl font-black"
                    style={{ color: "var(--on-surface)" }}
                  >
                    Plate {plate.num}
                  </p>
                  <p
                    className="font-bold mt-1"
                    style={{ color: "var(--primary)" }}
                  >
                    Won at {aed(winningBid)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment deadline */}
            <div
              className="mt-4 rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "rgba(217,119,6,0.08)",
                border: "1px solid rgba(217,119,6,0.2)",
              }}
            >
              <Clock
                size={18}
                strokeWidth={1.8}
                style={{ color: "var(--amber)" }}
              />
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--amber)" }}
                >
                  Payment Deadline: 23h 59m
                </p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  Please complete the payment within the next 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Right: Summary + CTA */}
          <div className="space-y-4">
            {/* Cost summary */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface-container-low)" }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-[2px] mb-4"
                style={{ color: "var(--outline)" }}
              >
                Payment Summary
              </p>
              {[
                { label: "Winning Bid", value: aed(winningBid) },
                { label: "Escrow & Fees", value: aed(fee) },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between py-3 border-b"
                  style={{ borderColor: "rgba(187,202,199,0.2)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3">
                <span
                  className="font-bold"
                  style={{ color: "var(--on-surface)" }}
                >
                  Total Amount
                </span>
                <span
                  className="font-black text-xl"
                  style={{ color: "var(--primary)" }}
                >
                  {aed(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push(`/plates/${plate.id}/checkout`)}
              className="w-full h-14 rounded-xl font-bold flex items-center justify-center cursor-pointer border-none text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
              }}
            >
              Proceed to Payment — {aed(total)}
            </button>

            <button
              className="w-full h-12 rounded-xl font-semibold cursor-pointer"
              style={{
                background: "transparent",
                color: "var(--on-surface-variant)",
                border: "1px solid rgba(187,202,199,0.3)",
              }}
            >
              Decline Win
            </button>

            <p
              className="text-xs text-center leading-relaxed"
              style={{ color: "var(--outline)" }}
            >
              Sakk escrow protects both parties. Your payment is held securely
              until the RTA ownership transfer is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
