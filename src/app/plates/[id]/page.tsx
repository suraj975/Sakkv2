"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
  BadgeCheck,
  UserCircle,
  ShoppingCart,
  Gift,
  TrendingUp,
  Hammer,
  Eye,
  Bell,
  ShieldCheck,
} from "lucide-react";
import {
  getPlateById,
  aed,
  escrowFee,
  MOCK_BIDS,
  minNextBid,
} from "@/lib/plates";
import CountdownTimer from "@/components/ui/CountdownTimer";
import BidHistory from "@/components/ui/BidHistory";

export default function PlateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const plate = getPlateById(id);

  if (!plate) return notFound();

  const isAuction = plate.listingType === "auction";
  const bids = MOCK_BIDS[plate.id] ?? [];
  const nextBid =
    isAuction && plate.currentBid && plate.minBidIncrement
      ? minNextBid(plate.currentBid, plate.minBidIncrement)
      : 0;

  const avg = plate.price * 1.12;
  const below = plate.price < avg * 0.93;
  const above = plate.price > avg * 1.07;
  const mLabel = below ? "Below Market" : above ? "Above Market" : "Fair Price";
  const mLabelColor = below ? "#006E2D" : above ? "#BA1A1A" : "var(--primary)";
  const mLabelBg = below
    ? "rgba(67,194,101,0.15)"
    : above
      ? "rgba(186,26,26,0.12)"
      : "rgba(12,191,184,0.15)";

  const min = Math.round(plate.price * 0.68);
  const max = Math.round(plate.price * 1.48);
  const pct = Math.min(
    92,
    Math.max(8, Math.round(((plate.price - min) / (max - min)) * 100)),
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 glass-nav"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none"
          style={{ color: "var(--on-surface)" }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        {/* Desktop breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push("/auctions")}
            className="cursor-pointer bg-transparent border-none font-medium"
            style={{ color: "var(--primary)" }}
          >
            {isAuction ? "Auctions" : "Marketplace"}
          </button>
          <span style={{ color: "var(--outline)" }}>›</span>
          <span style={{ color: "var(--on-surface-variant)" }}>
            {plate.emirate} {plate.code} {plate.num}
          </span>
        </div>
        {/* Mobile title */}
        <span
          className="lg:hidden font-bold text-base"
          style={{ color: "var(--on-surface)" }}
        >
          {isAuction ? "Live Auction" : "Plate Details"}
        </span>
        <div className="flex gap-1">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none"
            style={{ color: "var(--on-surface)" }}
          >
            <Share2 size={18} strokeWidth={1.8} />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-none"
            style={{ color: "var(--on-surface)" }}
          >
            <Heart size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section
        className="relative flex items-center justify-center p-6 pb-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
          minHeight: 220,
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
        <div className="absolute bottom-5 left-5 flex gap-2">
          <span
            className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              backdropFilter: "blur(8px)",
            }}
          >
            {plate.emirate.toUpperCase()} ASSET
          </span>
          {isAuction && (
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
              style={{ background: "rgba(186,26,26,0.25)", color: "#FCA5A5" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Desktop: Countdown boxes inside hero (top-right) */}
        {isAuction && plate.auctionEndTime && (
          <div className="absolute top-5 right-5 hidden lg:flex flex-col items-end gap-2">
            <span className="text-[9px] font-black uppercase tracking-[2px] text-white opacity-70">
              AUCTION ENDS IN
            </span>
            <CountdownTimer endTime={plate.auctionEndTime} variant="boxes" />
          </div>
        )}
      </section>

      {/* ── Desktop: two-col / Mobile: stacked ── */}
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:px-8 lg:pt-8 lg:pb-12 lg:items-start">
        {/* LEFT */}
        <div>
          {/* ── AUCTION: Current Bid card + mobile countdown ── */}
          {isAuction ? (
            <div className="px-5 py-5 lg:px-0 -mt-5 lg:mt-0 relative z-10">
              <div
                className="rounded-2xl p-5 lg:rounded-none lg:p-0"
                style={{
                  background: "var(--surface-container-lowest)",
                  boxShadow: "0 4px 18px rgba(25,28,29,0.1)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      Current Bid
                    </p>
                    <h2
                      className="text-3xl font-black tracking-tight"
                      style={{ color: "var(--primary)" }}
                    >
                      {aed(plate.currentBid ?? 0)}
                    </h2>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {plate.bidCount} active bids · Reserve price met
                    </p>
                  </div>
                  <span
                    className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase"
                    style={{
                      background: "rgba(186,26,26,0.1)",
                      color: "var(--error)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "var(--error)" }}
                    />
                    LIVE
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-sm"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  <MapPin size={13} strokeWidth={1.8} />
                  <span>{plate.emirate}, UAE</span>
                  <span className="mx-1 opacity-30">•</span>
                  <span>Auction · LOT #{plate.lotNumber}</span>
                </div>

                {/* Mobile urgency countdown card */}
                {plate.auctionEndTime && (
                  <div
                    className="lg:hidden mt-4 rounded-xl p-3 flex items-center justify-between"
                    style={{
                      background: "rgba(186,26,26,0.08)",
                      border: "1px solid rgba(186,26,26,0.15)",
                    }}
                  >
                    <div>
                      <p
                        className="text-[9px] font-black uppercase tracking-wider mb-1"
                        style={{ color: "var(--error)" }}
                      >
                        Auction Ends In
                      </p>
                      <CountdownTimer
                        endTime={plate.auctionEndTime}
                        variant="strip"
                      />
                    </div>
                    <span
                      className="text-[9px] font-black px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(186,26,26,0.12)",
                        color: "var(--error)",
                      }}
                    >
                      Ending Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── FIXED: Price card ── */
            <div className="px-5 py-5 lg:px-0 -mt-5 lg:mt-0 relative z-10">
              <div
                className="rounded-2xl p-5 lg:rounded-none lg:p-0"
                style={{
                  background: "var(--surface-container-lowest)",
                  boxShadow: "0 4px 18px rgba(25,28,29,0.1)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      Asking Price
                    </p>
                    {plate.orig && (
                      <p
                        className="text-sm line-through"
                        style={{ color: "var(--outline)" }}
                      >
                        {aed(plate.orig)}
                      </p>
                    )}
                    <h2
                      className="text-3xl font-black tracking-tight"
                      style={{ color: "var(--primary)" }}
                    >
                      {aed(plate.price)}
                    </h2>
                    {plate.orig && (
                      <span
                        className="inline-block text-[9px] font-black px-2 py-0.5 rounded-full mt-1"
                        style={{
                          background: "rgba(0,110,45,0.12)",
                          color: "var(--tertiary)",
                        }}
                      >
                        SAVE {Math.round((1 - plate.price / plate.orig) * 100)}%
                      </span>
                    )}
                  </div>
                  {plate.verified && (
                    <span
                      className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase"
                      style={{
                        background: "rgba(67,194,101,0.15)",
                        color: "var(--tertiary)",
                      }}
                    >
                      VERIFIED
                    </span>
                  )}
                </div>
                <div
                  className="flex items-center gap-1.5 text-sm"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  <MapPin size={13} strokeWidth={1.8} />
                  <span>{plate.emirate}, UAE</span>
                  <span className="mx-1 opacity-30">•</span>
                  <span>Direct Sale</span>
                </div>
              </div>
            </div>
          )}

          {/* Market Analysis — fixed only */}
          {!isAuction && (
            <div className="px-5 pb-4 lg:px-0 lg:pb-6">
              <div
                className="rounded-2xl p-5"
                style={{ background: "var(--surface-container-low)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      size={16}
                      strokeWidth={2}
                      style={{ color: "var(--primary)" }}
                    />
                    <span
                      className="font-bold"
                      style={{ color: "var(--on-surface)" }}
                    >
                      Market Price Analysis
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: mLabelBg, color: mLabelColor }}
                  >
                    {mLabel}
                  </span>
                </div>
                <div
                  className="relative h-3 rounded-full mb-2"
                  style={{
                    background:
                      "linear-gradient(to right, var(--error) 0%, var(--tertiary) 40%, var(--primary) 100%)",
                    opacity: 0.3,
                  }}
                ></div>
                <div className="relative -mt-3 h-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white absolute top-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(${pct}% - 8px)`,
                      background: "var(--primary)",
                      boxShadow: "0 2px 6px rgba(0,106,102,0.4)",
                    }}
                  />
                </div>
                <div
                  className="flex justify-between text-[9px] font-bold mb-3"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  <span>{aed(min)}</span>
                  <span>{aed(Math.round((min + max) / 2))}</span>
                  <span>{aed(max)}</span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Current asking price:{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {aed(plate.price)}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Seller */}
          <div className="px-5 pb-5 lg:px-0 lg:pb-6">
            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(187,202,199,0.12)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--surface-container-high)" }}
                >
                  <UserCircle
                    size={28}
                    strokeWidth={1.3}
                    style={{ color: "var(--primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {plate.seller}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    <BadgeCheck
                      size={11}
                      strokeWidth={2}
                      style={{ color: "var(--tertiary)" }}
                    />
                    <span>Verified Broker · {plate.days * 3} deals</span>
                  </div>
                </div>
              </div>
              <button
                className="text-sm font-bold cursor-pointer bg-transparent border-none"
                style={{ color: "var(--primary)" }}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Mobile CTAs */}
          <div className="lg:hidden px-5 pb-6 space-y-3">
            {isAuction ? (
              <>
                <button
                  onClick={() => router.push(`/plates/${plate.id}/auction/bid`)}
                  className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  }}
                >
                  <Hammer size={18} strokeWidth={2} /> Place a Bid
                  {nextBid > 0 && (
                    <span className="ml-1 font-normal text-sm opacity-80">
                      from {aed(nextBid)}
                    </span>
                  )}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/plates/${plate.id}/auction/watching`)
                    }
                    className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "var(--surface-container-high)",
                      color: "var(--primary)",
                      border: "none",
                    }}
                  >
                    <Eye size={16} strokeWidth={1.8} /> Watchlist
                  </button>
                  <button
                    className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "var(--surface-container-high)",
                      color: "var(--on-surface-variant)",
                      border: "none",
                    }}
                  >
                    <Share2 size={16} strokeWidth={1.8} /> Share
                  </button>
                  <button
                    className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "var(--surface-container-high)",
                      color: "var(--on-surface-variant)",
                      border: "none",
                    }}
                  >
                    <Bell size={16} strokeWidth={1.8} /> Alerts
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push(`/plates/${plate.id}/checkout`)}
                  className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  }}
                >
                  <ShoppingCart size={18} strokeWidth={2} /> Buy Now
                </button>
                <button
                  onClick={() => router.push(`/plates/${plate.id}/gift`)}
                  className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "var(--surface-container-high)",
                    color: "var(--primary)",
                    border: "none",
                  }}
                >
                  <Gift size={18} strokeWidth={1.8} /> Gift this Plate
                </button>
              </>
            )}
          </div>

          {/* Specifications */}
          <div className="px-5 pb-6 lg:px-0">
            <p
              className="text-[11px] font-black uppercase tracking-[2px] mb-4"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Specifications
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "SOURCE", value: `RTA ${plate.emirate}` },
                {
                  label: "DIGITS",
                  value: `${plate.num.length} Digit${plate.num.length !== 1 ? "s" : ""}`,
                },
                {
                  label: "SERIES",
                  value: plate.code ? `Series ${plate.code}` : "—",
                },
                { label: "TRANSFER", value: "Instant" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3.5"
                  style={{ background: "var(--surface-container-low)" }}
                >
                  <p
                    className="text-[9px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: "var(--outline)" }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bid History — auction mobile */}
          {isAuction && bids.length > 0 && (
            <div className="px-5 pb-6 lg:px-0">
              <BidHistory
                bids={bids}
                totalCount={plate.bidCount ?? bids.length}
              />
            </div>
          )}
        </div>

        {/* RIGHT (Desktop only) */}
        <div className="hidden lg:block">
          {isAuction ? (
            <>
              {/* Auction info panel */}
              <div
                className="rounded-2xl p-5 mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #063D3A 0%, var(--primary) 100%)",
                }}
              >
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[2px] text-white opacity-70 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  LIVE AUCTION
                </span>
                <p className="text-white font-bold mb-1">Auction Ends In</p>
                {plate.auctionEndTime && (
                  <div className="mb-4">
                    <CountdownTimer
                      endTime={plate.auctionEndTime}
                      variant="boxes"
                    />
                  </div>
                )}
                <div
                  className="rounded-xl p-3 mb-3"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white opacity-70 mb-1">
                    Current Highest Bid
                  </p>
                  <p className="text-2xl font-black text-white">
                    {aed(plate.currentBid ?? 0)}
                  </p>
                  <p className="text-xs text-white opacity-60 mt-0.5">
                    ≈ USD{" "}
                    {Math.round(
                      (plate.currentBid ?? 0) / 3.67,
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mb-4">
                  <BadgeCheck size={14} style={{ color: "#4ADE80" }} />
                  <span className="text-sm text-white opacity-80">
                    Reserve price met
                  </span>
                </div>
              </div>

              {/* Bid CTA */}
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => router.push(`/plates/${plate.id}/auction/bid`)}
                  className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  }}
                >
                  <Hammer size={18} strokeWidth={2} /> Place a Bid
                  {nextBid > 0 && (
                    <span className="ml-1 font-normal text-sm opacity-80">
                      — from {aed(nextBid)}
                    </span>
                  )}
                </button>
                <button
                  onClick={() =>
                    router.push(`/plates/${plate.id}/auction/watching`)
                  }
                  className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "var(--surface-container-high)",
                    color: "var(--primary)",
                    border: "none",
                  }}
                >
                  <Eye size={16} strokeWidth={1.8} /> Watch Auction
                </button>
              </div>

              {/* Trust badges */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: "var(--surface-container-low)",
                  border: "1px solid rgba(187,202,199,0.12)",
                }}
              >
                {[
                  { icon: BadgeCheck, label: "Verified by Dubai RTA" },
                  { icon: ShieldCheck, label: "Escrow protection" },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 mb-2 last:mb-0"
                  >
                    <t.icon
                      size={14}
                      strokeWidth={2}
                      style={{ color: "var(--tertiary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop Bid History */}
              {bids.length > 0 && (
                <BidHistory
                  bids={bids}
                  totalCount={plate.bidCount ?? bids.length}
                  defaultExpanded
                />
              )}
            </>
          ) : (
            <>
              {/* Escrow box */}
              <div
                className="rounded-2xl p-5 mb-4"
                style={{ background: "var(--surface-container-low)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(0,106,102,0.12)" }}
                >
                  <BadgeCheck
                    size={20}
                    strokeWidth={1.8}
                    style={{ color: "var(--primary)" }}
                  />
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: "var(--on-surface)" }}
                >
                  Protected by Sakk Escrow
                </h3>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Your funds are held securely in a regulated escrow account
                  until the RTA ownership transfer is successfully completed.
                </p>
                <p
                  className="text-xs font-bold mb-1"
                  style={{ color: "var(--outline)" }}
                >
                  Escrow fee: {aed(escrowFee(plate.price))}
                </p>
                {[
                  "Instant Ownership Transfer",
                  "Regulated Payment Gateway",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 mb-1.5">
                    <BadgeCheck
                      size={14}
                      strokeWidth={2}
                      style={{ color: "var(--tertiary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => router.push(`/plates/${plate.id}/checkout`)}
                  className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border-none text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  }}
                >
                  <ShoppingCart size={18} strokeWidth={2} /> Buy Now — Secured
                  by Escrow
                </button>
                <button
                  onClick={() => router.push(`/plates/${plate.id}/gift`)}
                  className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "var(--surface-container-high)",
                    color: "var(--primary)",
                    border: "none",
                  }}
                >
                  <Gift size={18} strokeWidth={1.8} /> Gift this Plate
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer border-none"
                  style={{
                    background: "var(--surface-container)",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <Share2 size={14} /> Share
                </button>
                <button
                  className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer border-none"
                  style={{
                    background: "var(--surface-container)",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <Heart size={14} /> Save to Watchlist
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
