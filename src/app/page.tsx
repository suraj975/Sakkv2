"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  CarFront,
  Bike,
  Anchor,
  Gift,
  Tag,
} from "lucide-react";
import PlateCard from "@/components/plates/PlateCard";
import PostListingModal from "@/components/PostListingModal";
import { PLATES } from "@/lib/plates";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const TABS = ["Car Plates", "Bike Plates", "Boat Numbers"];

const CATS = [
  { label: "Car Plates", count: "4,823 Active", Icon: CarFront },
  { label: "Bike Plates", count: "891 Active", Icon: Bike },
  { label: "Boat Numbers", count: "234 Active", Icon: Anchor },
];

const QUICK = [
  { label: "Deals", sub: "Hand-picked value plates", Icon: Tag, href: "/search?q=deals" },
  { label: "Quick Sale", sub: "Emergency listings", Icon: Zap, href: "/search?q=quick" },
  { label: "Gift a Plate", sub: "Transfer as digital voucher", Icon: Gift, href: "/plates/3/gift" },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isPostOpen, setIsPostOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Mobile Header */}
      <nav
        className="lg:hidden sticky top-0 z-40 glass-nav flex justify-between items-center px-4 h-14"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <span className="text-xl font-black" style={{ color: "var(--on-surface)" }}>Sakk</span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ color: "var(--primary)" }}>
            <Bell size={18} strokeWidth={1.8} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ color: "var(--primary)" }}>
            <HelpCircle size={18} strokeWidth={1.8} />
          </button>
        </div>
      </nav>

      {/* Desktop Header */}
      <header
        className="hidden lg:flex sticky top-0 z-40 glass-nav justify-between items-center px-8 h-16"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--on-surface)" }}>Marketplace</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors" style={{ color: "var(--on-surface-variant)" }}>
            <Bell size={18} strokeWidth={1.8} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors" style={{ color: "var(--on-surface-variant)" }}>
            <HelpCircle size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-10 lg:space-y-14 pb-28 lg:pb-16">

        {/* Hero */}
        <section
          className="relative h-[320px] lg:h-[380px] rounded-[24px] lg:rounded-[32px] overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--teal-darker) 0%, var(--primary) 60%, #00796b 100%)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay" }} />
          <div className="relative h-full flex items-center px-8 lg:px-12">
            <div className="space-y-5 max-w-lg">
              <Badge size="md" className="!bg-white/10 !text-white !border-white/20 !px-4 !py-1.5 rounded-full">
                UAE PLATE MARKETPLACE
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[0.95]">
                Safe Plate <br />Transfers
              </h1>
              <p className="text-white/80 text-base lg:text-lg font-semibold">
                Secured by Sakk · <span className="text-white/50 font-normal">The Middle East's Premier Asset Exchange</span>
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
              className={cn("cursor-pointer transition-all border-2 group",
                i === 0 ? "border-[var(--primary)] bg-[var(--teal-light)]" : "hover:border-[var(--outline-variant)]"
              )}
              style={i !== 0 ? { borderColor: "rgba(187,202,199,0.2)" } : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-base font-black" style={{ color: "var(--on-surface)" }}>{cat.label}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--outline)" }}>{cat.count}</p>
                </div>
                <cat.Icon
                  size={26}
                  style={{ color: i === 0 ? "var(--primary)" : "var(--outline)" }}
                  className="transition-colors group-hover:text-[var(--primary)]"
                />
              </div>
            </Card>
          ))}
        </div>

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
                <div className="p-3 rounded-xl" style={{ background: "var(--teal-light)" }}>
                  <feat.Icon size={18} style={{ color: "var(--primary)" }} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black" style={{ color: "var(--on-surface)" }}>{feat.label}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--outline)" }}>{feat.sub}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div
          className="py-10 grid grid-cols-3 gap-8 text-center"
          style={{ borderTop: "1px solid var(--surface-container)", borderBottom: "1px solid var(--surface-container)" }}
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
              <p className="text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: "var(--on-surface)" }}>{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--outline)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trending Plates */}
        <section className="space-y-7">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--on-surface)" }}>Trending Plates</h2>
              <div className="flex items-center gap-6 lg:gap-8" style={{ borderBottom: "1px solid var(--surface-container)" }}>
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className="pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative"
                    style={{ color: activeTab === i ? "var(--on-surface)" : "var(--outline)" }}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {PLATES.map((plate, i) => (
              <PlateCard key={plate.id} plate={plate} index={i} />
            ))}
          </div>
        </section>

        {/* Post Plate CTA Banner */}
        <section
          className="rounded-[24px] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ background: "var(--teal-darker)" }}
        >
          <div className="text-center lg:text-left space-y-2">
            <h3 className="text-2xl font-black text-white">Have a plate to sell?</h3>
            <p className="text-white/60 font-medium">List it in under 2 minutes. Reach thousands of verified buyers.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
              <ShieldCheck size={16} className="text-[var(--primary-container)]" />
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

      <PostListingModal isOpen={isPostOpen} onClose={() => setIsPostOpen(false)} />
    </div>
  );
}
