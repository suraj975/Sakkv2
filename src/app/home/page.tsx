"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  HelpCircle,
  ShieldCheck,
  Zap,
  CarFront,
  Bike,
  Anchor,
  Gift,
  Tag,
  Hammer,
  X,
  Sparkles,
} from "lucide-react";
import PlateCard from "@/components/plates/PlateCard";
import PostListingModal from "@/components/PostListingModal";
import { getPlates, getAuctionPlates } from "@/lib/firestore";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { FSPlate } from "@/types/firebase";

const TABS = ["Car Plates", "Bike Plates", "Boat Numbers"];

const CATS = [
  {
    label: "Car Plates",
    count: "4,823 Active",
    Icon: CarFront,
    available: true,
  },
  { label: "Bike Plates", count: "891 Active", Icon: Bike, available: false },
  {
    label: "Boat Numbers",
    count: "234 Active",
    Icon: Anchor,
    available: false,
  },
];

/* ── Coming Soon Modal ───────────────────────────────────────── */
function ComingSoonModal({
  category,
  Icon,
  onClose,
}: {
  category: string;
  Icon: React.ElementType;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isBike = category === "Bike Plates";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,61,58,0.75)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[28px]"
        style={{
          background:
            "linear-gradient(145deg, #063D3A 0%, #006A66 55%, #0a5552 100%)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(12,191,184,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ background: "var(--primary-container)" }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-[0.07]"
          style={{ background: "var(--primary-container)" }}
        />

        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0CBFB8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <X size={14} />
        </button>

        <div className="relative px-8 pt-10 pb-9 flex flex-col items-center text-center gap-5">
          {/* Icon badge */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-[20px] flex items-center justify-center"
              style={{
                background: "rgba(12,191,184,0.15)",
                border: "1px solid rgba(12,191,184,0.25)",
              }}
            >
              <Icon size={36} style={{ color: "var(--primary-container)" }} />
            </div>
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-[20px] animate-ping opacity-20"
              style={{ border: "2px solid var(--primary-container)" }}
            />
          </div>

          {/* Pill badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{
              background: "rgba(12,191,184,0.12)",
              border: "1px solid rgba(12,191,184,0.2)",
              color: "var(--primary-container)",
            }}
          >
            <Sparkles size={10} />
            Coming Soon
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {category}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {isBike
                ? "We're curating the UAE's finest motorcycle and bike plate listings. Exclusive numbers, special codes — launching very soon."
                : "Exclusive maritime registration numbers and boat plate transfers across all UAE marinas. Launching very soon."}
            </p>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* Stats row */}
          <div className="flex items-center gap-6 w-full justify-center">
            {(isBike
              ? [
                  { v: "891", l: "Plates Ready" },
                  { v: "Q3", l: "Launch Target" },
                  { v: "UAE", l: "Coverage" },
                ]
              : [
                  { v: "234", l: "Numbers Ready" },
                  { v: "Q3", l: "Launch Target" },
                  { v: "7", l: "Emirates" },
                ]
            ).map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-black text-white">{s.v}</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl text-sm font-black transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "var(--primary-container)",
              color: "var(--teal-darker)",
            }}
          >
            Notify Me When Live
          </button>
        </div>
      </div>
    </div>
  );
}

const QUICK = [
  {
    label: "Deals",
    sub: "Hand-picked value plates",
    Icon: Tag,
    href: "/search?q=deals",
  },
  {
    label: "Quick Sale",
    sub: "Emergency listings",
    Icon: Zap,
    href: "/search?q=quick",
  },
  {
    label: "Gift a Plate",
    sub: "Transfer as digital voucher",
    Icon: Gift,
    href: "/plates/plate_003/gift",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [plates, setPlates] = useState<FSPlate[]>([]);
  const [auctionPlates, setAuctionPlates] = useState<FSPlate[]>([]);
  const [loading, setLoading] = useState(true);
  const [comingSoon, setComingSoon] = useState<{
    label: string;
    Icon: React.ElementType;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [all, auctions] = await Promise.all([
          getPlates({ limitCount: 12 }),
          getAuctionPlates(),
        ]);
        setPlates(all);
        setAuctionPlates(auctions);
      } catch (err) {
        console.error("Failed to load plates:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      {comingSoon && (
        <ComingSoonModal
          category={comingSoon.label}
          Icon={comingSoon.Icon}
          onClose={() => setComingSoon(null)}
        />
      )}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <nav
          className="lg:hidden sticky top-0 z-40 glass-nav flex justify-between items-center px-4 h-14"
          style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
        >
          <span
            className="text-xl font-black"
            style={{ color: "var(--on-surface)" }}
          >
            Sakk
          </span>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ color: "var(--primary)" }}
            >
              <Bell size={18} strokeWidth={1.8} />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ color: "var(--primary)" }}
            >
              <HelpCircle size={18} strokeWidth={1.8} />
            </button>
          </div>
        </nav>

        {/* Desktop Header */}
        <header
          className="hidden lg:flex sticky top-0 z-40 glass-nav justify-between items-center px-8 h-16"
          style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
        >
          <h1
            className="text-xl font-black tracking-tight"
            style={{ color: "var(--on-surface)" }}
          >
            Marketplace
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <Bell size={18} strokeWidth={1.8} />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <HelpCircle size={18} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-10 lg:space-y-14 pb-28 lg:pb-16">
          {/* Hero */}
          <section
            className="relative h-[320px] lg:h-[380px] rounded-[24px] lg:rounded-[32px] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--teal-darker) 0%, var(--primary) 60%, #00796b 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                mixBlendMode: "overlay",
              }}
            />
            <div className="relative h-full flex items-center px-8 lg:px-12">
              <div className="space-y-5 max-w-lg">
                <Badge
                  size="md"
                  className="!bg-white/10 !text-white !border-white/20 !px-4 !py-1.5 rounded-full"
                >
                  UAE PLATE MARKETPLACE
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[0.95]">
                  Safe Plate <br />
                  Transfers
                </h1>
                <p className="text-white/80 text-base lg:text-lg font-semibold">
                  Secured by Sakk ·{" "}
                  <span className="text-white/50 font-normal">
                    The Middle East's Premier Asset Exchange
                  </span>
                </p>
                <Button
                  onClick={() => router.push("/search")}
                  className="!bg-white/10 !text-white border border-white/20 hover:!bg-white/20 !rounded-xl"
                  size="md"
                >
                  Browse Listings
                </Button>
              </div>
            </div>
          </section>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CATS.map((cat, i) => (
              <Card
                key={i}
                padding="lg"
                className={cn(
                  "cursor-pointer transition-all border-2 group relative overflow-hidden",
                  i === 0
                    ? "border-[var(--primary)] bg-[var(--teal-light)]"
                    : "hover:border-[var(--outline-variant)]",
                )}
                style={
                  i !== 0 ? { borderColor: "rgba(187,202,199,0.2)" } : undefined
                }
                onClick={
                  !cat.available
                    ? () => setComingSoon({ label: cat.label, Icon: cat.Icon })
                    : undefined
                }
              >
                {/* Coming Soon overlay badge */}
                {!cat.available && (
                  <span
                    className="absolute top-2.5 right-2.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(6,61,58,0.08)",
                      color: "var(--teal-darker)",
                      border: "1px solid rgba(6,61,58,0.12)",
                    }}
                  >
                    Soon
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p
                      className="text-base font-black"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {cat.label}
                    </p>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--outline)" }}
                    >
                      {cat.available ? cat.count : "Coming Soon"}
                    </p>
                  </div>
                  <cat.Icon
                    size={26}
                    style={{
                      color: i === 0 ? "var(--primary)" : "var(--outline)",
                    }}
                    className="transition-colors group-hover:text-[var(--primary)]"
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Live Auctions (mobile) */}
          {auctionPlates.length > 0 && (
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "var(--error)" }}
                  />
                  <h3
                    className="text-base font-black"
                    style={{ color: "var(--on-surface)" }}
                  >
                    Live Auctions
                  </h3>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(186,26,26,0.1)",
                      color: "var(--error)",
                    }}
                  >
                    {auctionPlates.length} LIVE
                  </span>
                </div>
                <button
                  onClick={() => router.push("/auctions")}
                  className="text-xs font-bold cursor-pointer bg-transparent border-none flex items-center gap-1"
                  style={{ color: "var(--primary)" }}
                >
                  <Hammer size={12} /> View All
                </button>
              </div>
              <div
                className="flex gap-3 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {auctionPlates.slice(0, 4).map((p, i) => (
                  <div key={p.id} className="flex-none w-[150px]">
                    <PlateCard plate={p} index={i} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUICK.map((feat, i) => (
              <Card
                key={i}
                padding="md"
                onClick={() => router.push(feat.href)}
                className="cursor-pointer group hover:border-[var(--outline-variant)] transition-all"
                style={{ borderColor: "rgba(187,202,199,0.12)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: "var(--teal-light)" }}
                  >
                    <feat.Icon size={18} style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="space-y-0.5">
                    <p
                      className="text-sm font-black"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {feat.label}
                    </p>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--outline)" }}
                    >
                      {feat.sub}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div
            className="py-10 grid grid-cols-3 gap-8 text-center"
            style={{
              borderTop: "1px solid var(--surface-container)",
              borderBottom: "1px solid var(--surface-container)",
            }}
          >
            {[
              { value: "80K+", label: "TRANSFERS / YEAR" },
              { value: "100%", label: "ESCROW SAFE" },
              { value: "GCC", label: "READY" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 relative">
                {i !== 0 && (
                  <div
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10"
                    style={{ background: "var(--surface-container)" }}
                  />
                )}
                <p
                  className="text-4xl lg:text-5xl font-black tracking-tighter"
                  style={{ color: "var(--on-surface)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.2em]"
                  style={{ color: "var(--outline)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Live Auctions (desktop) */}
          {auctionPlates.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ background: "var(--error)" }}
                  />
                  <h2
                    className="text-2xl font-black tracking-tight"
                    style={{ color: "var(--on-surface)" }}
                  >
                    Live Auctions
                  </h2>
                  <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(186,26,26,0.1)",
                      color: "var(--error)",
                    }}
                  >
                    {auctionPlates.length} ACTIVE
                  </span>
                </div>
                <button
                  onClick={() => router.push("/auctions")}
                  className="text-sm font-bold cursor-pointer bg-transparent border-none flex items-center gap-1.5"
                  style={{ color: "var(--primary)" }}
                >
                  <Hammer size={14} /> View all auctions
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {auctionPlates.map((p, i) => (
                  <PlateCard key={p.id} plate={p} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Trending Plates */}
          <section className="space-y-7">
            <div className="flex items-end justify-between">
              <div className="space-y-4">
                <h2
                  className="text-3xl font-black tracking-tight"
                  style={{ color: "var(--on-surface)" }}
                >
                  Trending Plates
                </h2>
                <div
                  className="flex items-center gap-6 lg:gap-8"
                  style={{ borderBottom: "1px solid var(--surface-container)" }}
                >
                  {TABS.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className="pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative"
                      style={{
                        color:
                          activeTab === i
                            ? "var(--on-surface)"
                            : "var(--outline)",
                      }}
                    >
                      {tab}
                      {activeTab === i && (
                        <span
                          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                          style={{ background: "var(--primary)" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="font-black uppercase tracking-widest hover:!bg-transparent"
                style={{ color: "var(--primary)" }}
                onClick={() => router.push("/search")}
              >
                View all
              </Button>
            </div>

            {loading ? (
              <div
                className="col-span-4 py-16 text-center text-sm"
                style={{ color: "var(--outline)" }}
              >
                Loading plates...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {plates.map((plate, i) => (
                  <PlateCard key={plate.id} plate={plate} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* Post Plate CTA Banner */}
          <section
            className="rounded-[24px] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6"
            style={{ background: "var(--teal-darker)" }}
          >
            <div className="text-center lg:text-left space-y-2">
              <h3 className="text-2xl font-black text-white">
                Have a plate to sell?
              </h3>
              <p className="text-white/60 font-medium">
                List it in under 2 minutes. Reach thousands of verified buyers.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                <ShieldCheck
                  size={16}
                  className="text-[var(--primary-container)]"
                />
                Escrow Protected
              </div>
              <Button
                onClick={() => setIsPostOpen(true)}
                className="!bg-[var(--primary-container)] !text-[var(--teal-darker)] font-black hover:brightness-110 whitespace-nowrap"
                size="lg"
              >
                Post a Plate
              </Button>
            </div>
          </section>
        </div>

        <PostListingModal
          isOpen={isPostOpen}
          onClose={() => setIsPostOpen(false)}
        />
      </div>
    </>
  );
}
