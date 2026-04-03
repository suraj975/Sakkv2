"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import { aed, minNextBid } from "@/lib/plates";
import { getPlateById, placeBid, subscribeBids } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { toISOString } from "@/lib/utils";
import CountdownTimer from "@/components/ui/CountdownTimer";
import LoginModal from "@/components/auth/LoginModal";
import AuthGateModal from "@/components/auth/AuthGateModal";
import type { FSPlate, FSBid } from "@/types/firebase";

export default function AuctionBidPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();

  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [bids, setBids] = useState<FSBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);

  // Load plate
  useEffect(() => {
    getPlateById(id).then((p) => {
      setPlate(p);
      if (p) {
        const min =
          p.currentBid && p.minBidIncrement
            ? minNextBid(p.currentBid, p.minBidIncrement)
            : (p.currentBid ?? 0);
        setBidAmount(min);
      }
      setLoading(false);
    });
  }, [id]);

  // Real-time bid feed
  useEffect(() => {
    if (!id) return;
    const unsub = subscribeBids(id, setBids);
    return () => unsub();
  }, [id]);

  const minBid =
    plate?.currentBid && plate?.minBidIncrement
      ? minNextBid(plate.currentBid, plate.minBidIncrement)
      : (plate?.currentBid ?? 0);

  const isValid = bidAmount >= minBid;

  const handleConfirm = async () => {
    if (!user || !plate?.id) {
      setLoginOpen(true);
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      await placeBid(
        plate.id,
        user.uid,
        profile?.displayName ?? user.displayName ?? "Anonymous",
        bidAmount,
      );
      router.push(`/plates/${id}/auction/watching`);
    } catch (err: unknown) {
      setError(
        (err as Error).message ?? "Failed to place bid. Please try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ color: "var(--outline)" }}
      >
        Loading auction...
      </div>
    );
  }

  if (!plate || plate.listingType !== "auction") {
    router.replace("/auctions");
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {loginOpen && (
        <AuthGateModal
          destinationHref={`/plates/${id}/auction/bid`}
          onClose={() => setLoginOpen(false)}
        />
      )}
      {/* ── Mobile Header ── */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center h-14 px-4 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none mr-2"
          style={{ color: "var(--on-surface)" }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span
          className="font-bold text-base"
          style={{ color: "var(--on-surface)" }}
        >
          Place a Bid
        </span>
      </header>

      {/* ── Desktop Header (breadcrumb style) ── */}
      <header
        className="hidden lg:flex sticky top-0 z-40 items-center justify-between h-16 px-8 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft size={16} /> Back to Auction
        </button>
        <span
          className="font-bold text-base"
          style={{ color: "var(--on-surface)" }}
        >
          Confirm Your Bid
        </span>
        <div className="w-32" />
      </header>

      {/* ══════════════════════ MOBILE ══════════════════════ */}
      <div className="lg:hidden pb-28">
        {/* Plate hero */}
        <section
          className="flex items-center justify-center py-6"
          style={{
            background:
              "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
          }}
        >
          <div className="plate-viz-shadow">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="lg"
            />
          </div>
        </section>

        <div className="px-4 pt-4 space-y-4">
          {/* Subtitle */}
          <div>
            <p
              className="font-bold text-lg"
              style={{ color: "var(--on-surface)" }}
            >
              {plate.emirate} Plate · Series {plate.code}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Current Highest Bid: {aed(plate.currentBid ?? 0)}
            </p>
          </div>

          {/* Countdown strip */}
          {plate.auctionEndTime && (
            <div
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ background: "var(--surface-container-low)" }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--outline)" }}
              >
                Time Remaining
              </span>
              <CountdownTimer
                endTime={toISOString(plate.auctionEndTime)}
                variant="strip"
              />
            </div>
          )}

          {/* Bid input card */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid rgba(187,202,199,0.12)",
            }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-[2px] mb-3"
              style={{ color: "var(--outline)" }}
            >
              Your Bid Amount
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="font-bold text-sm"
                style={{ color: "var(--on-surface-variant)" }}
              >
                AED
              </span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="flex-1 text-2xl font-black outline-none bg-transparent border-none"
                style={{ color: "var(--primary)" }}
              />
            </div>
            <div
              className="h-px mb-3"
              style={{
                background: isValid ? "var(--tertiary)" : "var(--outline)",
              }}
            />
            <p
              className="text-xs"
              style={{ color: isValid ? "var(--tertiary)" : "var(--outline)" }}
            >
              {isValid
                ? `✓ Valid bid · Minimum increment met`
                : `Minimum bid: ${aed(minBid)} (increment: ${aed(plate.minBidIncrement ?? 0)})`}
            </p>
          </div>

          {/* Binding agreement */}
          <div
            className="rounded-2xl p-4 flex gap-3"
            style={{
              background: "rgba(217,119,6,0.08)",
              border: "1px solid rgba(217,119,6,0.2)",
            }}
          >
            <AlertTriangle
              size={16}
              strokeWidth={2}
              className="flex-shrink-0 mt-0.5"
              style={{ color: "var(--amber)" }}
            />
            <div>
              <p
                className="text-sm font-bold mb-1"
                style={{ color: "var(--amber)" }}
              >
                Binding Bid Agreement
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#92400E" }}
              >
                By placing this bid, you enter a legally binding commitment to
                purchase this plate at the winning price. Withdrawal after
                winning may result in a penalty.
              </p>
            </div>
          </div>

          {/* Confirm button */}
          {error && (
            <div
              className="px-3 py-2.5 rounded-xl text-xs"
              style={{ background: "rgba(186,26,26,0.08)", color: "#BA1A1A" }}
            >
              {error}
            </div>
          )}
          <button
            onClick={handleConfirm}
            disabled={!isValid || placing}
            className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
            style={{
              background: isValid
                ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)"
                : "var(--surface-container-high)",
              color: isValid ? "white" : "var(--outline)",
            }}
          >
            {placing && <Loader2 size={16} className="animate-spin" />}
            Confirm Bid — {aed(bidAmount)}
          </button>

          {/* Deposit note */}
          <p
            className="text-[10px] text-center leading-relaxed"
            style={{ color: "var(--outline)" }}
          >
            A holding deposit of {aed(10000)} will be authorized on your linked
            payment method to place this bid.
          </p>

          {/* Stats footer */}
          <div
            className="rounded-2xl p-4 flex justify-around"
            style={{ background: "var(--surface-container-low)" }}
          >
            <div className="text-center">
              <p
                className="text-lg font-black"
                style={{ color: "var(--primary)" }}
              >
                {plate.bidCount}
              </p>
              <p
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: "var(--outline)" }}
              >
                Bidders Active
              </p>
            </div>
            <div
              className="w-px"
              style={{ background: "rgba(187,202,199,0.4)" }}
            />
            <div className="text-center">
              <p
                className="text-lg font-black"
                style={{ color: "var(--on-surface)" }}
              >
                1.2k
              </p>
              <p
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: "var(--outline)" }}
              >
                Views Total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════ DESKTOP ══════════════════════ */}
      <div className="hidden lg:block max-w-[960px] mx-auto px-8 pt-8 pb-12">
        <div className="grid grid-cols-[1fr_400px] gap-8 items-start">
          {/* Left: Plate info card */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid rgba(187,202,199,0.12)",
            }}
          >
            <div
              className="flex items-center justify-center py-10"
              style={{
                background:
                  "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
              }}
            >
              <PlateViz
                code={plate.code}
                num={plate.num}
                emirate={plate.emirate}
                type={plate.type}
                size="lg"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--outline)" }}
                  >
                    LOT #{plate.lotNumber}
                  </p>
                  <p
                    className="font-bold text-lg mt-0.5"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {plate.emirate} {plate.code} {plate.num}
                  </p>
                </div>
                <BadgeCheck size={20} style={{ color: "var(--tertiary)" }} />
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs" style={{ color: "var(--outline)" }}>
                    Current Bid
                  </p>
                  <p
                    className="font-black text-xl"
                    style={{ color: "var(--primary)" }}
                  >
                    {aed(plate.currentBid ?? 0)}
                  </p>
                </div>
                {plate.auctionEndTime && (
                  <div className="text-right">
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--outline)" }}
                    >
                      Time Left
                    </p>
                    <CountdownTimer
                      endTime={toISOString(plate.auctionEndTime)}
                      variant="inline"
                    />
                    <p
                      className="text-[9px] mt-0.5"
                      style={{ color: "var(--outline)" }}
                    >
                      HRS : MIN : SEC
                    </p>
                  </div>
                )}
              </div>

              {/* Bid history preview */}
              {bids.slice(0, 3).map((bid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: "rgba(187,202,199,0.1)" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: bid.isWinning
                          ? "rgba(0,110,45,0.15)"
                          : "var(--surface-container-low)",
                        color: bid.isWinning
                          ? "var(--tertiary)"
                          : "var(--on-surface-variant)",
                      }}
                    >
                      {bid.bidderName.slice(0, 2).toUpperCase()}
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {bid.bidderName}
                    </span>
                    {bid.isWinning && (
                      <span
                        className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(0,110,45,0.12)",
                          color: "var(--tertiary)",
                        }}
                      >
                        LEADING
                      </span>
                    )}
                  </div>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {aed(bid.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bid form */}
          <div className="space-y-4">
            <h2
              className="text-2xl font-black"
              style={{ color: "var(--on-surface)" }}
            >
              Confirm Your Bid
            </h2>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
              }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-[2px] mb-3"
                style={{ color: "var(--outline)" }}
              >
                Your Bid
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-bold"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  AED
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="flex-1 text-3xl font-black outline-none bg-transparent border-none"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <div
                className="h-px mb-2"
                style={{
                  background: isValid
                    ? "var(--tertiary)"
                    : "rgba(187,202,199,0.3)",
                }}
              />
              <p
                className="text-xs"
                style={{
                  color: isValid ? "var(--tertiary)" : "var(--outline)",
                }}
              >
                {isValid
                  ? `✓ Valid bid: Minimum increment met`
                  : `Minimum bid is ${aed(minBid)}`}
              </p>
            </div>

            <div
              className="rounded-2xl p-4 flex gap-3"
              style={{
                background: "rgba(186,26,26,0.06)",
                border: "1px solid rgba(186,26,26,0.15)",
              }}
            >
              <AlertTriangle
                size={16}
                strokeWidth={2}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "var(--error)" }}
              />
              <div>
                <p
                  className="text-sm font-bold mb-1"
                  style={{ color: "var(--error)" }}
                >
                  Binding Agreement
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  By placing this bid, you agree to purchase if you win. Ensure
                  your payment method is ready before confirming.
                </p>
              </div>
            </div>

            {error && (
              <div
                className="px-3 py-2.5 rounded-xl text-xs"
                style={{ background: "rgba(186,26,26,0.08)", color: "#BA1A1A" }}
              >
                {error}
              </div>
            )}
            <button
              onClick={handleConfirm}
              disabled={!isValid || placing}
              className="w-full h-14 rounded-xl font-bold flex items-center justify-center cursor-pointer border-none text-white"
              style={{
                background: isValid
                  ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)"
                  : "var(--surface-container-high)",
                color: isValid ? "white" : "var(--outline)",
              }}
            >
              {placing && <Loader2 size={16} className="animate-spin mr-1" />}
              Confirm Bid — {aed(bidAmount)}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full text-center text-sm cursor-pointer bg-transparent border-none"
              style={{ color: "var(--outline)" }}
            >
              Cancel and return
            </button>

            {/* Trust footer */}
            <div className="flex justify-around pt-2">
              {[
                { Icon: ShieldCheck, label: "SECURE CHECKOUT" },
                { Icon: BadgeCheck, label: "VERIFIED ASSET" },
                { Icon: Lock, label: "256-BIT ENCRYPTION" },
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <t.Icon
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--outline)" }}
                  />
                  <span
                    className="text-[8px] font-bold uppercase tracking-wider text-center"
                    style={{ color: "var(--outline)" }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
