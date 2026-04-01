"use client";

import { useState } from "react";
import { TrendingUp, BarChart2, ArrowUpRight, Sparkles } from "lucide-react";
import Hero from "@/components/ui/Hero";
import Pill from "@/components/ui/Pill";
import TLine from "@/components/ui/TLine";
import PlateViz from "@/components/plates/PlateViz";
import type { PlateType } from "@/types";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah"];
const COMPARABLES = [
  { c: "R", n: "11500", p: 92000, change: "+4%" },
  { c: "R", n: "10800", p: 88000, change: "-2%" },
  { c: "R", n: "11200", p: 105000, change: "+12%" },
];

const inp = {
  width: "100%",
  background: "var(--sakk-card)",
  border: "1px solid var(--sakk-border)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 13,
  color: "var(--sakk-text)",
  boxSizing: "border-box" as const,
  outline: "none",
};

function plateTypeForEmirate(em: string): PlateType {
  if (em === "Abu Dhabi") return "abudhabi";
  if (em === "Sharjah") return "sharjah";
  return "gold";
}

export default function EstimatorPage() {
  const [estEm, setEstEm] = useState("Dubai");
  const [estCode, setEstCode] = useState("");
  const [estNum, setEstNum] = useState("");
  const [done, setDone] = useState(false);

  const canEstimate = estCode.trim().length > 0 && estNum.trim().length > 0;
  const showPreview = estCode.trim().length > 0 || estNum.trim().length > 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <Hero
        tag="PLATE ESTIMATOR"
        h1="What is your plate"
        ac="worth?"
        sub="Instant market estimate powered by real transaction data"
      />

      {/* Two-column on desktop, stacked on mobile */}
      <div
        className="lg:grid lg:grid-cols-2"
        style={{ borderTop: "1px solid var(--sakk-border)" }}
      >
        {/* ── Left: Form ── */}
        <div
          className="p-5 lg:p-8"
          style={{ borderRight: "1px solid var(--sakk-border)" }}
        >
          <h2
            className="text-sm font-semibold mb-5"
            style={{ color: "var(--sakk-text)" }}
          >
            Enter plate details
          </h2>

          <div className="mb-4">
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
              style={{ color: "var(--sakk-text3)" }}
            >
              Emirate
            </label>
            <select
              value={estEm}
              onChange={(e) => setEstEm(e.target.value)}
              style={{ ...inp, appearance: "none" }}
            >
              {EMIRATES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
              style={{ color: "var(--sakk-text3)" }}
            >
              Plate Code / Letter
            </label>
            <input
              value={estCode}
              onChange={(e) => setEstCode(e.target.value.toUpperCase())}
              placeholder="e.g. A, B, R, P, H"
              style={inp}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
              style={{ color: "var(--sakk-text3)" }}
            >
              Plate Number
            </label>
            <input
              value={estNum}
              onChange={(e) => setEstNum(e.target.value)}
              placeholder="e.g. 5, 100, 786, 4242"
              style={inp}
            />
          </div>

          <button
            onClick={() => {
              if (canEstimate) setDone(true);
            }}
            disabled={!canEstimate}
            className="btn-primary w-full border-none rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 mb-6"
            style={{
              background: canEstimate ? "var(--teal)" : "#C0E8E6",
              cursor: canEstimate ? "pointer" : "not-allowed",
            }}
          >
            <Sparkles size={15} strokeWidth={2} />
            Estimate Value
          </button>

          {/* Live plate preview — desktop only */}
          {showPreview && (
            <div
              className="hidden lg:flex flex-col items-center gap-3 pt-4 animate-scale-in"
              style={{ borderTop: "1px solid var(--sakk-border)" }}
            >
              <div
                className="text-[11px] font-medium"
                style={{ color: "var(--sakk-text3)" }}
              >
                Live preview
              </div>
              <div className="plate-shadow">
                <PlateViz
                  code={estCode || "?"}
                  num={estNum || "0000"}
                  emirate={estEm}
                  type={plateTypeForEmirate(estEm)}
                  size="lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Estimate results ── */}
        <div className="p-5 lg:p-8" style={{ background: "var(--sakk-bg)" }}>
          {!done ? (
            <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--teal-light)" }}
              >
                <BarChart2 size={24} style={{ color: "var(--teal)" }} />
              </div>
              <div
                className="text-sm font-medium mb-1.5"
                style={{ color: "var(--sakk-text2)" }}
              >
                Your estimate will appear here
              </div>
              <div className="text-xs" style={{ color: "var(--sakk-text3)" }}>
                Enter plate details and press Estimate Value
              </div>
            </div>
          ) : (
            <div className="animate-fade-up">
              {/* Mobile plate preview */}
              <div className="flex lg:hidden justify-center mb-5">
                <div className="plate-shadow">
                  <PlateViz
                    code={estCode}
                    num={estNum}
                    emirate={estEm}
                    type={plateTypeForEmirate(estEm)}
                    size="md"
                  />
                </div>
              </div>

              <div
                className="text-[11px] font-medium mb-0.5"
                style={{ color: "var(--sakk-text3)" }}
              >
                Estimated market value for{" "}
                <span style={{ color: "var(--sakk-text)", fontWeight: 600 }}>
                  {estEm} {estCode} {estNum}
                </span>
              </div>
              <div
                className="text-[28px] font-bold"
                style={{ color: "var(--teal-dark)" }}
              >
                AED 85,000
              </div>
              <div
                className="text-sm mb-2"
                style={{ color: "var(--sakk-text3)" }}
              >
                High estimate:{" "}
                <span style={{ color: "var(--sakk-text)" }}>AED 110,000</span>
              </div>
              <TLine />

              <div className="flex gap-1.5 mb-5 flex-wrap">
                <Pill txt={estEm} />
                {estCode && <Pill txt={estCode} />}
                <Pill txt="45 recent sales" hi />
              </div>

              {/* Market metrics */}
              <div
                className="rounded-xl p-4 mb-3"
                style={{
                  background: "var(--sakk-card)",
                  border: "1px solid var(--sakk-border)",
                }}
              >
                <div
                  className="text-xs font-semibold mb-3"
                  style={{ color: "var(--sakk-text)" }}
                >
                  Market Metrics
                </div>
                {[
                  { l: "Demand", v: 78, good: true },
                  { l: "Rarity", v: 62, good: false },
                  { l: "Liquidity", v: 85, good: true },
                ].map((bar) => (
                  <div key={bar.l} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--sakk-text2)" }}>
                        {bar.l}
                      </span>
                      <span
                        style={{
                          color: bar.good ? "var(--teal)" : "var(--sakk-text3)",
                          fontWeight: 600,
                        }}
                      >
                        {bar.v}/100
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--sakk-bg)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.v}%`,
                          background: bar.good ? "var(--teal)" : "#B8BCC4",
                          transition: "width 0.7s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparables */}
              <div
                className="rounded-xl p-4 mb-3"
                style={{
                  background: "var(--sakk-card)",
                  border: "1px solid var(--sakk-border)",
                }}
              >
                <div
                  className="text-xs font-semibold mb-3"
                  style={{ color: "var(--sakk-text)" }}
                >
                  Comparable sales
                </div>
                {COMPARABLES.map((x, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2"
                    style={{
                      borderBottom:
                        i < 2 ? "1px solid var(--sakk-border)" : "none",
                    }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: "var(--sakk-text2)" }}
                    >
                      Dubai {x.c} {x.n}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--sakk-text)" }}
                      >
                        AED {x.p.toLocaleString()}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color: x.change.startsWith("+")
                            ? "#16A34A"
                            : "#DC2626",
                        }}
                      >
                        {x.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insight tiles */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  {
                    Icon: TrendingUp,
                    l: "Market trend",
                    v: "↑ +8% this month",
                  },
                  {
                    Icon: ArrowUpRight,
                    l: "Best time to sell",
                    v: "Now — high demand",
                  },
                ].map(({ Icon, l, v }) => (
                  <div
                    key={l}
                    className="rounded-xl p-3 flex items-start gap-2"
                    style={{
                      background: "var(--teal-light)",
                      border: "1px solid var(--teal-border)",
                    }}
                  >
                    <Icon
                      size={13}
                      style={{
                        color: "var(--teal)",
                        marginTop: 1,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        className="text-[10px]"
                        style={{ color: "var(--teal-dark)", opacity: 0.7 }}
                      >
                        {l}
                      </div>
                      <div
                        className="text-[11px] font-semibold mt-0.5"
                        style={{ color: "var(--teal-dark)" }}
                      >
                        {v}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="btn-primary w-full border-none rounded-xl py-3 text-sm font-semibold text-white cursor-pointer"
                style={{ background: "var(--teal)" }}
              >
                List this Plate on Sakk →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
