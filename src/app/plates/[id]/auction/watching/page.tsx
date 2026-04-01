"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { Bell, ArrowLeft, Hammer, TrendingUp, Loader2 } from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import { aed } from "@/lib/plates";
import { getPlateById, subscribeBids, subscribePlate } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import type { FSPlate, FSBid } from "@/types/firebase";
import { toISOString } from "@/lib/utils";
import CountdownTimer from "@/components/ui/CountdownTimer";
import BidHistory from "@/components/ui/BidHistory";

const QUICK_INCREMENTS = [500, 1000, 5000];

export default function AuctionWatchingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [bids, setBids] = useState<FSBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingIncrement, setPendingIncrement] = useState<number | null>(null);

  useEffect(() => {
    getPlateById(id).then((p) => {
      setPlate(p);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const unsub = subscribePlate(id, (p) => setPlate(p));
    return unsub;
  }, [id]);

  useEffect(() => {
    const unsub = subscribeBids(id, setBids);
    return unsub;
  }, [id]);

  if (loading)
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ color: "var(--outline)" }}
      >
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  if (!plate || plate.listingType !== "auction") return notFound();

  const myBid = plate.currentBid ?? 0;
  const isLeading = bids.length > 0 && bids[0].bidderId === user?.uid;
  const nextBid = plate.minBidIncrement ? myBid + plate.minBidIncrement : myBid;

  const handleIncrement = (inc: number) => {
    setPendingIncrement(inc);
    router.push(`/plates/${plate.id}/auction/bid?amount=${myBid + inc}`);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── Mobile Header ── */}
      <header
        className="lg:hidden sticky top-0 z-40 flex justify-between items-center h-14 px-4 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: "var(--on-surface)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <span
          className="font-bold text-base"
          style={{ color: "var(--on-surface)" }}
        >
          Watching Auction
        </span>
        <button
          className="w-9 h-9 flex items-center justify-center cursor-pointer bg-transparent border-none"
          style={{ color: "var(--primary)" }}
        >
          <Bell size={18} strokeWidth={1.8} />
        </button>
      </header>

      {/* ── Desktop Header ── */}
      <header
        className="hidden lg:flex sticky top-0 z-40 items-center justify-between h-16 px-8 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer bg-transparent border-none"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft size={16} /> Auctions
        </button>
        <h1
          className="text-lg font-black"
          style={{ color: "var(--on-surface)" }}
        >
          Auction Live
        </h1>
        <button
          className="w-10 h-10 flex items-center justify-center cursor-pointer bg-transparent border-none"
          style={{ color: "var(--on-surface-variant)" }}
        >
          <Bell size={18} strokeWidth={1.8} />
        </button>
      </header>

      {/* ══════════════════════ MOBILE ══════════════════════ */}
      <div className="lg:hidden pb-28">
        {/* Leading banner */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: isLeading
              ? "rgba(0,110,45,0.1)"
              : "rgba(217,119,6,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold"
              style={{ color: isLeading ? "var(--tertiary)" : "var(--amber)" }}
            >
              {isLeading ? "✓ Your Bid is Leading!" : "You've been outbid"}
            </span>
          </div>
          <span
            className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
            style={{
              background: isLeading
                ? "rgba(0,110,45,0.15)"
                : "rgba(217,119,6,0.15)",
              color: isLeading ? "var(--tertiary)" : "var(--amber)",
            }}
          >
            ACTIVE
          </span>
        </div>

        {/* Large plate */}
        <section
          className="flex items-center justify-center py-8"
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
        </section>

        <div className="px-4 pt-4 space-y-4">
          {/* YOUR BID / TIME LEFT cards */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
              }}
            >
              <p
                className="text-[9px] font-black uppercase tracking-wider mb-1"
                style={{ color: "var(--outline)" }}
              >
                Your Bid
              </p>
              <p
                className="font-black text-base"
                style={{ color: "var(--primary)" }}
              >
                {aed(myBid)}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--tertiary)" }}
              >
                High Bidder
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
              }}
            >
              <p
                className="text-[9px] font-black uppercase tracking-wider mb-1"
                style={{ color: "var(--outline)" }}
              >
                Time Left
              </p>
              {plate.auctionEndTime ? (
                <>
                  <CountdownTimer
                    endTime={toISOString(plate.auctionEndTime)}
                    variant="inline"
                  />
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--error)" }}
                  >
                    Closing Soon
                  </p>
                </>
              ) : (
                <p
                  className="font-black text-base"
                  style={{ color: "var(--on-surface)" }}
                >
                  —
                </p>
              )}
            </div>
          </div>

          {/* Quick Increment */}
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-wider mb-2"
              style={{ color: "var(--outline)" }}
            >
              Quick Increment
            </p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_INCREMENTS.map((inc) => (
                <button
                  key={inc}
                  onClick={() => handleIncrement(inc)}
                  className="h-12 rounded-xl font-bold text-sm cursor-pointer border-none"
                  style={{
                    background:
                      pendingIncrement === inc
                        ? "var(--primary)"
                        : "var(--surface-container-low)",
                    color:
                      pendingIncrement === inc ? "white" : "var(--primary)",
                  }}
                >
                  +{inc >= 1000 ? `${inc / 1000}K` : inc}
                </button>
              ))}
            </div>
          </div>

          {/* Bid History */}
          <BidHistory bids={bids} totalCount={plate.bidCount ?? bids.length} />

          {/* Plate Highlights */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--surface-container-low)" }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-wider mb-3"
              style={{ color: "var(--outline)" }}
            >
              Plate Highlights
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label:
                    plate.num.length <= 2
                      ? "RARE 2-DIGIT"
                      : `${plate.num.length}-DIGIT`,
                  sub: "Exclusive category",
                },
                { label: "RTA CERTIFIED", sub: "Verified asset" },
                { label: plate.emirate.toUpperCase(), sub: "Emirates plate" },
                {
                  label: plate.sellerIsVerified
                    ? "VERIFIED SELLER"
                    : "DIRECT SELLER",
                  sub: plate.sellerName,
                },
              ].map((h, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3"
                  style={{ background: "var(--surface-container-lowest)" }}
                >
                  <p
                    className="text-[9px] font-black uppercase tracking-wider"
                    style={{ color: "var(--primary)" }}
                  >
                    {h.label}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {h.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Place Custom Bid CTA */}
          <button
            onClick={() => router.push(`/plates/${plate.id}/auction/bid`)}
            className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
            }}
          >
            <Hammer size={18} strokeWidth={2} /> Place Custom Bid
          </button>

          <p
            className="text-[10px] text-center"
            style={{ color: "var(--outline)" }}
          >
            All bids are binding. By bidding you agree to our terms and
            conditions.
          </p>

          {/* Won shortcut (for demo) */}
          <button
            onClick={() => router.push(`/plates/${plate.id}/auction/won`)}
            className="w-full text-center text-xs cursor-pointer bg-transparent border-none"
            style={{ color: "var(--outline)" }}
          >
            Demo: View Won State →
          </button>
        </div>
      </div>

      {/* ══════════════════════ DESKTOP ══════════════════════ */}
      <div className="hidden lg:block max-w-[1200px] mx-auto px-8 pt-6 pb-12">
        {/* Leading banner */}
        <div
          className="rounded-2xl px-5 py-3 flex items-center justify-between mb-6"
          style={{
            background: "rgba(0,110,45,0.08)",
            border: "1px solid rgba(0,110,45,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,110,45,0.12)" }}
            >
              <TrendingUp size={16} style={{ color: "var(--tertiary)" }} />
            </div>
            <div>
              <p className="font-bold" style={{ color: "var(--tertiary)" }}>
                Your Bid is Leading!
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--on-surface-variant)" }}
              >
                You are currently the highest bidder
              </p>
            </div>
          </div>
          <span
            className="text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider"
            style={{
              background: "rgba(0,110,45,0.12)",
              color: "var(--tertiary)",
            }}
          >
            LIVE AUCTION TRACKING
          </span>
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left: Plate + details */}
          <div>
            <div
              className="rounded-3xl overflow-hidden mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
                minHeight: 280,
              }}
            >
              <div className="flex items-center justify-center py-12">
                <PlateViz
                  code={plate.code}
                  num={plate.num}
                  emirate={plate.emirate}
                  type={plate.type}
                  size="lg"
                />
              </div>
            </div>

            {/* Plate metadata */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Asset Class", value: `${plate.emirate} Plate` },
                { label: "Category", value: `${plate.code} Series` },
                {
                  label: "Seller Type",
                  value: plate.sellerIsVerified ? "Verified" : "Individual",
                },
                { label: "Transfer", value: "Immediate RTA" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3"
                  style={{ background: "var(--surface-container-low)" }}
                >
                  <p
                    className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: "var(--outline)" }}
                  >
                    {m.label}
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Full Bid History */}
            <BidHistory
              bids={bids}
              totalCount={plate.bidCount ?? bids.length}
              defaultExpanded
            />
          </div>

          {/* Right: Bid panel */}
          <div className="space-y-4 sticky top-20">
            {/* Your active bid card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
              }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-wider mb-1"
                style={{ color: "var(--outline)" }}
              >
                Your Active Bid
              </p>
              <div className="flex items-end justify-between mb-2">
                <p
                  className="text-2xl font-black"
                  style={{ color: "var(--primary)" }}
                >
                  {aed(myBid)}
                </p>
                <span
                  className="text-[9px] font-black px-2 py-1 rounded-full uppercase"
                  style={{
                    background: "rgba(0,110,45,0.12)",
                    color: "var(--tertiary)",
                  }}
                >
                  LEADING
                </span>
              </div>
              <p
                className="text-xs mb-4"
                style={{ color: "var(--on-surface-variant)" }}
              >
                ≈ USD {Math.round(myBid / 3.67).toLocaleString()}
              </p>
              <button
                onClick={() => router.push(`/plates/${plate.id}/auction/bid`)}
                className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                }}
              >
                <Hammer size={16} /> Increase Your Bid
              </button>
            </div>

            {/* Countdown card */}
            {plate.auctionEndTime && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background:
                    "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-[2px] text-white opacity-70 mb-3">
                  Auction Ends In
                </p>
                <CountdownTimer
                  endTime={toISOString(plate.auctionEndTime)}
                  variant="boxes"
                />
              </div>
            )}

            {/* Quick increment */}
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-wider mb-2"
                style={{ color: "var(--outline)" }}
              >
                Quick Bid Increment
              </p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_INCREMENTS.map((inc) => (
                  <button
                    key={inc}
                    onClick={() => handleIncrement(inc)}
                    className="h-10 rounded-xl font-bold text-sm cursor-pointer border-none"
                    style={{
                      background: "var(--surface-container-low)",
                      color: "var(--primary)",
                    }}
                  >
                    +{inc >= 1000 ? `${inc / 1000}K` : inc}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo: Won state */}
            <button
              onClick={() => router.push(`/plates/${plate.id}/auction/won`)}
              className="w-full text-center text-xs cursor-pointer bg-transparent border-none"
              style={{ color: "var(--outline)" }}
            >
              Demo: View Won State →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
