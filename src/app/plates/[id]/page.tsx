"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import {
  ArrowLeft,
  Share2,
  Heart,
  ShieldCheck,
  BarChart3,
  User,
  Eye,
  Gift,
  TrendingUp,
} from "lucide-react";
import { getPlateById, aed, escrowFee } from "@/lib/plates";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function PlateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const plate = getPlateById(id);

  if (!plate) return notFound();

  const avg = plate.price * 1.08;
  const below = plate.price < avg * 0.95;
  const fee = escrowFee(plate.price);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header
        className="sticky top-0 z-40 glass-nav flex justify-between items-center h-14 lg:h-16 px-4 lg:px-8"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-none bg-transparent transition-colors hover:bg-[var(--surface-container-low)]"
          style={{ color: "var(--on-surface)" }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span className="font-black text-base" style={{ color: "var(--on-surface)" }}>Plate Details</span>
        <div className="flex gap-1">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-none bg-transparent hover:bg-[var(--surface-container-low)] transition-colors"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Share2 size={17} strokeWidth={1.8} />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-none bg-transparent hover:bg-[var(--surface-container-low)] transition-colors"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Heart size={17} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative h-[320px] lg:h-[400px] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--teal-darker) 0%, var(--primary) 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <Badge size="md" className="!bg-white/10 !text-white !border-white/20 !px-4 !py-1.5 rounded-full">
            PREMIUM ASSET
          </Badge>
          <div className="plate-shadow">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="lg"
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
              <ShieldCheck size={14} className="text-[var(--primary-container)]" />
              RTA VERIFIED
            </div>
            <div className="w-px h-3 bg-white/15" />
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
              <Eye size={14} />
              {(plate.price / 100).toFixed(0)}K VIEWS
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 pb-28 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left: Info */}
          <div className="lg:col-span-8 space-y-8">

            {/* Title + Price */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-5xl font-black tracking-tight" style={{ color: "var(--on-surface)" }}>
                  {plate.emirate} {plate.code} {plate.num}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{plate.emirate}</Badge>
                  <Badge variant="secondary">Code {plate.code}</Badge>
                  <Badge variant="primary">{plate.num.length} Digits</Badge>
                </div>
              </div>
              <div className="space-y-1 md:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--outline)" }}>CURRENT PRICE</p>
                <p className="text-3xl lg:text-4xl font-black" style={{ color: "var(--primary)" }}>{aed(plate.price)}</p>
                {below && (
                  <p className="text-[10px] font-bold uppercase" style={{ color: "var(--tertiary)" }}>
                    ↓ BELOW MARKET AVERAGE
                  </p>
                )}
              </div>
            </div>

            {/* Seller + Market Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="xl" className="space-y-5" style={{ boxShadow: "0 4px 18px rgba(25,28,29,0.07)" }}>
                <div className="flex items-center gap-3">
                  <User size={18} style={{ color: "var(--outline)" }} />
                  <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--on-surface-variant)" }}>SELLER INFORMATION</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base"
                    style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
                  >
                    {plate.seller.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-black" style={{ color: "var(--on-surface)" }}>{plate.seller}</p>
                    <p className="text-xs font-bold" style={{ color: "var(--outline)" }}>Member since 2021 · 14 Sales</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--surface-container)" }}>
                  <Button variant="outline" className="flex-1 !text-xs !font-bold">Chat with Seller</Button>
                  <Button variant="outline" className="!px-3"><Share2 size={15} /></Button>
                </div>
              </Card>

              <Card padding="xl" className="space-y-5" style={{ boxShadow: "0 4px 18px rgba(25,28,29,0.07)" }}>
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} style={{ color: "var(--outline)" }} />
                  <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--on-surface-variant)" }}>MARKET PRICE ANALYSIS</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold" style={{ color: "var(--on-surface-variant)" }}>Market Average</span>
                    <span className="text-xs font-black" style={{ color: "var(--on-surface)" }}>{aed(avg)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden relative" style={{ background: "var(--surface-container)" }}>
                    <div className="h-full w-4/5 rounded-full" style={{ background: "var(--surface-container-high)" }} />
                    <div className="absolute left-[70%] top-0 bottom-0 w-1 rounded-full" style={{ background: "var(--primary)", zIndex: 10 }} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--tertiary)" }}>
                    LISTED {below ? "8% BELOW" : "AT"} MARKET AVERAGE
                  </p>
                </div>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-black" style={{ color: "var(--on-surface)" }}>Asset Description</h3>
              <p className="font-medium leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                Highly sought-after {plate.num.length}-digit {plate.emirate} plate with the classic '{plate.code}' series.
                This plate has seen consistent 12% year-on-year appreciation. Perfect for investment or personal use on a luxury vehicle.
                RTA transfer can be completed within 24 hours via Sakk's escrow-protected system.
              </p>
            </div>

            {/* Market trend chip */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "var(--teal-light)", border: "1px solid rgba(0,106,102,0.1)" }}
            >
              <TrendingUp size={20} style={{ color: "var(--primary)" }} />
              <div>
                <p className="text-sm font-black" style={{ color: "var(--primary)" }}>+12% YoY Appreciation</p>
                <p className="text-xs font-medium" style={{ color: "var(--primary)", opacity: 0.7 }}>
                  This plate category has outperformed the market for 3 consecutive years.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="lg:col-span-4">
            <div
              className="rounded-2xl p-6 space-y-6 lg:sticky lg:top-24"
              style={{ background: "var(--surface-container-low)", border: "1px solid var(--surface-container)" }}
            >
              {/* Escrow badge */}
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--surface-container)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--teal-light)" }}>
                  <ShieldCheck size={18} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <p className="text-xs font-black" style={{ color: "var(--on-surface)" }}>Escrow Protected</p>
                  <p className="text-[10px] font-bold" style={{ color: "var(--outline)" }}>Secure UAE-based payment</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Button
                  size="xl"
                  className="w-full !py-4 !text-base !font-black !rounded-2xl"
                  style={{ boxShadow: "0 6px 20px rgba(0,106,102,0.25)" }}
                  onClick={() => router.push(`/plates/${plate.id}/checkout`)}
                >
                  Buy Now
                </Button>
                <Button size="xl" variant="outline" className="w-full !py-4 !text-base !font-black !rounded-2xl">
                  Make an Offer
                </Button>
              </div>

              {/* Fee breakdown */}
              <div className="space-y-3 pt-2" style={{ borderTop: "1px solid var(--surface-container)" }}>
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--on-surface-variant)" }}>
                  <span>Platform Fee</span>
                  <span style={{ color: "var(--on-surface)" }}>{aed(fee)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--on-surface-variant)" }}>
                  <span>RTA Transfer Fee</span>
                  <span style={{ color: "var(--on-surface)" }}>AED 120</span>
                </div>
              </div>

              {/* Gift CTA */}
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 !text-sm !font-black"
                style={{ color: "var(--primary)" }}
                onClick={() => router.push(`/plates/${plate.id}/gift`)}
              >
                <Gift size={16} /> Buy as a Gift
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
