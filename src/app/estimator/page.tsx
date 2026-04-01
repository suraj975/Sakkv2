"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { PlateType } from "@/types";

const METRICS = [
  { label: "Demand", value: 78, color: "var(--primary)" },
  { label: "Rarity", value: 62, color: "var(--on-surface-variant)" },
  { label: "Liquidity", value: 85, color: "var(--primary-container)" },
];

const COMP_SALES = [
  { plate: "R 11500", price: "AED 92,000", trend: "+4%" },
  { plate: "A 992", price: "AED 740,000", trend: "+12%" },
  { plate: "S 7860", price: "AED 115,000", trend: "+2.5%" },
];

function getType(em: string): PlateType {
  if (em === "Abu Dhabi") return "abudhabi";
  if (em === "Sharjah") return "sharjah";
  return "gold";
}

export default function EstimatorPage() {
  const [emirate, setEmirate] = useState("Dubai");
  const [code, setCode] = useState("A");
  const [number, setNumber] = useState("786");

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header
        className="sticky top-0 z-40 glass-nav flex items-center justify-between px-6 lg:px-8 h-14 lg:h-16"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <h1 className="text-lg lg:text-xl font-black tracking-tight" style={{ color: "var(--on-surface)" }}>Plate Estimator</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 pb-28 lg:pb-16">

        {/* Page Title */}
        <header className="space-y-5">
          <Badge size="md" className="!bg-[var(--teal-light)] !text-[var(--primary)] !border-none !px-4 !py-1.5 rounded-full">
            PLATE ESTIMATOR
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[0.95]" style={{ color: "var(--on-surface)" }}>
            What is your plate worth?
          </h1>
          <p className="text-base lg:text-lg font-medium leading-relaxed max-w-2xl" style={{ color: "var(--on-surface-variant)" }}>
            Instant market estimate based on historical auction data and real-time marketplace demand.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Left: Form & Preview */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-7">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full" style={{ background: "var(--primary)" }} />
                <h2 className="text-xl font-black" style={{ color: "var(--on-surface)" }}>Enter plate details</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--outline)" }}>EMIRATE</label>
                  <div className="relative">
                    <select
                      value={emirate}
                      onChange={(e) => setEmirate(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl text-base font-bold focus:outline-none transition-all appearance-none cursor-pointer"
                      style={{ background: "var(--surface-container-lowest)", border: "1.5px solid var(--surface-container)", color: "var(--on-surface)", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(25,28,29,0.04)" }}
                    >
                      <option>Dubai</option>
                      <option>Abu Dhabi</option>
                      <option>Sharjah</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--outline)" }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--outline)" }}>PLATE CODE</label>
                    <input
                      type="text"
                      placeholder="e.g. A"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full px-5 py-4 rounded-2xl text-base font-bold focus:outline-none transition-all"
                      style={{ background: "var(--surface-container-lowest)", border: "1.5px solid var(--surface-container)", color: "var(--on-surface)", fontFamily: "inherit" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--outline)" }}>PLATE NUMBER</label>
                    <input
                      type="text"
                      placeholder="e.g. 786"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl text-base font-bold focus:outline-none transition-all"
                      style={{ background: "var(--surface-container-lowest)", border: "1.5px solid var(--surface-container)", color: "var(--on-surface)", fontFamily: "inherit" }}
                    />
                  </div>
                </div>

                <Button
                  size="xl"
                  className="w-full !py-4 !text-base !font-black !rounded-2xl flex items-center justify-center gap-2"
                  style={{ boxShadow: "0 8px 24px rgba(0,106,102,0.25)" }}
                >
                  Estimate Value <Zap size={18} fill="currentColor" />
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center" style={{ color: "var(--outline)" }}>LIVE PREVIEW</p>
              <div className="flex justify-center">
                <PlateViz
                  emirate={emirate}
                  code={code}
                  num={number}
                  type={getType(emirate)}
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7 space-y-6">
            <Card padding="xl" className="space-y-8" style={{ boxShadow: "0 8px 28px rgba(25,28,29,0.08)" }}>
              <div className="space-y-4">
                <p className="text-xs font-bold" style={{ color: "var(--outline)" }}>
                  Estimated market value for {emirate} {code} {number}
                </p>
                <div className="space-y-1">
                  <h2 className="text-5xl lg:text-6xl font-black tracking-tight" style={{ color: "var(--primary)" }}>AED 850,000</h2>
                  <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                    High estimate: <span style={{ color: "var(--on-surface-variant)" }}>AED 920,000</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">{emirate}</Badge>
                  <Badge variant="secondary">Code {code}</Badge>
                  <Badge variant="primary" className="!bg-[var(--teal-darker)] !text-white">45 recent sales</Badge>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--outline)" }}>MARKET METRICS</h3>
                <div className="space-y-5">
                  {METRICS.map((m) => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black" style={{ color: "var(--on-surface)" }}>{m.label}</span>
                        <span className="text-xs font-black" style={{ color: "var(--primary)" }}>{m.value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--surface-container)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--outline)" }}>COMPARABLE SALES</h3>
                <div className="divide-y" style={{ borderColor: "var(--surface-container)" }}>
                  {COMP_SALES.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <span className="text-sm font-black" style={{ color: "var(--on-surface)" }}>{s.plate}</span>
                      <div className="text-right">
                        <p className="text-sm font-black" style={{ color: "var(--on-surface)" }}>{s.price}</p>
                        <p className="text-[10px] font-bold" style={{ color: "var(--tertiary)" }}>{s.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Button
              size="xl"
              className="w-full !py-4 !text-base !font-black !rounded-2xl flex items-center justify-center gap-2"
              style={{ boxShadow: "0 6px 20px rgba(0,106,102,0.22)" }}
            >
              List Your Plate <ExternalLink size={18} />
            </Button>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-6">
          <Card padding="xl" className="md:col-span-2 space-y-5" style={{ background: "var(--surface-container-low)", borderColor: "rgba(187,202,199,0.1)" }}>
            <h3 className="text-2xl font-black" style={{ color: "var(--on-surface)" }}>Market Trends</h3>
            <p className="font-medium leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Plate values have increased by 14% on average in Dubai over the last 12 months. Three-digit plates are seeing the highest liquidity.
            </p>
            <button className="flex items-center gap-2 text-sm font-black hover:underline" style={{ color: "var(--primary)" }}>
              View full market report <ArrowRight size={15} />
            </button>
          </Card>

          <Card padding="xl" className="relative overflow-hidden space-y-5" style={{ background: "var(--teal-darker)", borderColor: "transparent" }}>
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <ShieldCheck size={22} style={{ color: "var(--primary-container)" }} />
              </div>
              <h3 className="text-xl font-black text-white">Escrow Protection</h3>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                All transactions secured via our UAE-based escrow system.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
