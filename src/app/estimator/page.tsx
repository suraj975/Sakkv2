"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Check,
  X,
} from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { PlateType } from "@/types/firebase";

const METRICS = [
  { label: "Demand", value: 78, color: "var(--primary)" },
  { label: "Rarity", value: 62, color: "var(--on-surface-variant)" },
  { label: "Liquidity", value: 85, color: "var(--primary-container)" },
];

const EMIRATE_OPTIONS = [
  { value: "Dubai", label: "Dubai", short: "DXB", dot: "#C9A84C" },
  { value: "Abu Dhabi", label: "Abu Dhabi", short: "AUH", dot: "#C92E3C" },
  { value: "Sharjah", label: "Sharjah", short: "SHJ", dot: "#1F7A35" },
  { value: "Ajman", label: "Ajman", short: "AJM", dot: "#42526E" },
  { value: "RAK", label: "Ras Al Khaimah", short: "RAK", dot: "#3B6E78" },
  { value: "Fujairah", label: "Fujairah", short: "FUJ", dot: "#6F8183" },
  { value: "UAQ", label: "Umm Al Quwain", short: "UAQ", dot: "#7E8A8C" },
];

function aed(value: number) {
  return `AED ${value.toLocaleString()}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getType(em: string): PlateType {
  if (em === "Abu Dhabi") return "abudhabi";
  if (em === "Sharjah") return "sharjah";
  return "gold";
}

function EmiratePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDesktopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const active = useMemo(
    () =>
      EMIRATE_OPTIONS.find((item) => item.value === value) ??
      EMIRATE_OPTIONS[0],
    [value],
  );

  return (
    <>
      <div ref={ref} className="relative hidden md:block">
        <button
          type="button"
          onClick={() => setDesktopOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-base font-bold"
          style={{
            background: "var(--surface-container-lowest)",
            border: desktopOpen
              ? "1.5px solid rgba(0,106,102,0.35)"
              : "1.5px solid var(--surface-container)",
            color: "var(--on-surface)",
            boxShadow: "0 2px 8px rgba(25,28,29,0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black text-white"
              style={{ background: active.dot }}
            >
              {active.short}
            </span>
            <span>{active.label}</span>
          </div>
          <ChevronDown
            size={18}
            className="transition-transform"
            style={{
              color: "var(--outline)",
              transform: desktopOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {desktopOpen && (
          <div
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[24px] bg-white py-2 shadow-[0_18px_42px_rgba(25,28,29,0.14)]"
            style={{ border: "1px solid rgba(187,202,199,0.18)" }}
          >
            {EMIRATE_OPTIONS.map((item) => {
              const isActive = item.value === value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setDesktopOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
                  style={{
                    background: isActive
                      ? "rgba(12,191,184,0.1)"
                      : "transparent",
                    color: isActive ? "var(--primary)" : "var(--on-surface)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black text-white"
                      style={{ background: item.dot }}
                    >
                      {item.short}
                    </span>
                    <span className="text-[15px] font-bold">{item.label}</span>
                  </div>
                  {isActive && <Check size={16} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-base font-bold md:hidden"
        style={{
          background: "var(--surface-container-lowest)",
          border: "1.5px solid var(--surface-container)",
          color: "var(--on-surface)",
          boxShadow: "0 2px 8px rgba(25,28,29,0.04)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black text-white"
            style={{ background: active.dot }}
          >
            {active.short}
          </span>
          <span>{active.label}</span>
        </div>
        <SlidersHorizontal size={18} style={{ color: "var(--outline)" }} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/35 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full rounded-t-[32px] bg-white px-5 pb-6 pt-3 shadow-[0_-18px_48px_rgba(25,28,29,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1.5 w-14 rounded-full bg-[rgba(187,202,199,0.55)]" />

            <div className="mt-5 flex items-center justify-between">
              <h3 className="text-[18px] font-black text-[var(--on-surface)]">
                Select Emirate
              </h3>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-low)]"
              >
                <X size={18} style={{ color: "var(--on-surface-variant)" }} />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {EMIRATE_OPTIONS.map((item) => {
                const isActive = item.value === draft;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDraft(item.value)}
                    className="flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left transition-all"
                    style={{
                      background: isActive
                        ? "rgba(12,191,184,0.1)"
                        : "transparent",
                      color: "var(--on-surface)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-[13px] font-black text-white"
                        style={{ background: item.dot }}
                      >
                        {item.short}
                      </div>
                      <span className="text-[17px] font-bold">
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                        <Check size={15} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                onChange(draft);
                setMobileOpen(false);
              }}
              className="mt-6 w-full rounded-[16px] py-4 text-[18px] font-black text-white"
              style={{
                background: "linear-gradient(90deg, #0E7F79 0%, #1CC6C3 100%)",
                boxShadow: "0 12px 28px rgba(0,106,102,0.18)",
              }}
            >
              Apply Selection
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function buildDummyEstimate(emirate: string, code: string, number: string) {
  const digits = number.replace(/\D/g, "").length || 3;
  const baseByDigits = Math.max(1, 7 - digits) * 120000;
  const emirateBoost =
    emirate === "Dubai" ? 180000 : emirate === "Abu Dhabi" ? 140000 : 70000;
  const codeBoost =
    Math.max(0, 6 - Math.min(code.trim().length || 1, 5)) * 18000;
  const estimate =
    baseByDigits + emirateBoost + codeBoost + randomInt(15000, 220000);
  const highEstimate = estimate + randomInt(25000, 120000);
  const recentSales = randomInt(18, 58);
  const metrics = METRICS.map((metric) => ({
    ...metric,
    value: randomInt(52, 94),
  }));
  const comparableSales = Array.from({ length: 3 }, (_, index) => {
    const saleNumber = randomInt(10, 99999).toString();
    const salePrice = estimate + randomInt(-180000, 140000);
    const trendValue = (randomInt(10, 140) / 10).toFixed(1);
    return {
      plate: `${String.fromCharCode(65 + index)} ${saleNumber}`,
      price: aed(Math.max(25000, salePrice)),
      trend: `+${trendValue}%`,
    };
  });

  return {
    estimate,
    highEstimate,
    recentSales,
    metrics,
    comparableSales,
  };
}

export default function EstimatorPage() {
  const [emirate, setEmirate] = useState("Dubai");
  const [code, setCode] = useState("A");
  const [number, setNumber] = useState("786");
  const [estimateResult, setEstimateResult] = useState(() =>
    buildDummyEstimate("Dubai", "A", "786"),
  );

  function handleEstimate() {
    setEstimateResult(buildDummyEstimate(emirate, code, number));
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header
        className="sticky top-0 z-40 glass-nav flex items-center justify-between px-6 lg:px-8 h-14 lg:h-16"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <h1
          className="text-lg lg:text-xl font-black tracking-tight"
          style={{ color: "var(--on-surface)" }}
        >
          Plate Estimator
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 pb-28 lg:pb-16">
        {/* Page Title */}
        <header className="space-y-5">
          <Badge
            size="md"
            className="!bg-[var(--teal-light)] !text-[var(--primary)] !border-none !px-4 !py-1.5 rounded-full"
          >
            PLATE ESTIMATOR
          </Badge>
          <h1
            className="text-4xl lg:text-6xl font-black tracking-tight leading-[0.95]"
            style={{ color: "var(--on-surface)" }}
          >
            What is your plate worth?
          </h1>
          <p
            className="text-base lg:text-lg font-medium leading-relaxed max-w-2xl"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Instant market estimate based on historical auction data and
            real-time marketplace demand.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Form & Preview */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-7">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                <h2
                  className="text-xl font-black"
                  style={{ color: "var(--on-surface)" }}
                >
                  Enter plate details
                </h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    className="text-[10px] font-black uppercase tracking-widest ml-1"
                    style={{ color: "var(--outline)" }}
                  >
                    EMIRATE
                  </label>
                  <EmiratePicker value={emirate} onChange={setEmirate} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      className="text-[10px] font-black uppercase tracking-widest ml-1"
                      style={{ color: "var(--outline)" }}
                    >
                      PLATE CODE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. A"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full px-5 py-4 rounded-2xl text-base font-bold focus:outline-none transition-all"
                      style={{
                        background: "var(--surface-container-lowest)",
                        border: "1.5px solid var(--surface-container)",
                        color: "var(--on-surface)",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-[10px] font-black uppercase tracking-widest ml-1"
                      style={{ color: "var(--outline)" }}
                    >
                      PLATE NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 786"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl text-base font-bold focus:outline-none transition-all"
                      style={{
                        background: "var(--surface-container-lowest)",
                        border: "1.5px solid var(--surface-container)",
                        color: "var(--on-surface)",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>

                <Button
                  size="xl"
                  onClick={handleEstimate}
                  className="w-full !py-4 !text-base !font-black !rounded-2xl flex items-center justify-center gap-2"
                  style={{ boxShadow: "0 8px 24px rgba(0,106,102,0.25)" }}
                >
                  Estimate Value <Zap size={18} fill="currentColor" />
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] text-center"
                style={{ color: "var(--outline)" }}
              >
                LIVE PREVIEW
              </p>
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
            <Card
              padding="xl"
              className="space-y-8"
              style={{ boxShadow: "0 8px 28px rgba(25,28,29,0.08)" }}
            >
              <div className="space-y-4">
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--outline)" }}
                >
                  Estimated market value for {emirate} {code} {number}
                </p>
                <div className="space-y-1">
                  <h2
                    className="text-5xl lg:text-6xl font-black tracking-tight"
                    style={{ color: "var(--primary)" }}
                  >
                    {aed(estimateResult.estimate)}
                  </h2>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--on-surface)" }}
                  >
                    High estimate:{" "}
                    <span style={{ color: "var(--on-surface-variant)" }}>
                      {aed(estimateResult.highEstimate)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">{emirate}</Badge>
                  <Badge variant="secondary">Code {code}</Badge>
                  <Badge
                    variant="primary"
                    className="!bg-[var(--teal-darker)] !text-white"
                  >
                    {estimateResult.recentSales} recent sales
                  </Badge>
                </div>
              </div>

              <div className="space-y-5">
                <h3
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: "var(--outline)" }}
                >
                  MARKET METRICS
                </h3>
                <div className="space-y-5">
                  {estimateResult.metrics.map((m) => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className="text-xs font-black"
                          style={{ color: "var(--on-surface)" }}
                        >
                          {m.label}
                        </span>
                        <span
                          className="text-xs font-black"
                          style={{ color: "var(--primary)" }}
                        >
                          {m.value}%
                        </span>
                      </div>
                      <div
                        className="h-2 w-full rounded-full overflow-hidden"
                        style={{ background: "var(--surface-container)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${m.value}%`, background: m.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-2">
                <h3
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: "var(--outline)" }}
                >
                  COMPARABLE SALES
                </h3>
                <div
                  className="divide-y"
                  style={{ borderColor: "var(--surface-container)" }}
                >
                  {estimateResult.comparableSales.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3"
                    >
                      <span
                        className="text-sm font-black"
                        style={{ color: "var(--on-surface)" }}
                      >
                        {s.plate}
                      </span>
                      <div className="text-right">
                        <p
                          className="text-sm font-black"
                          style={{ color: "var(--on-surface)" }}
                        >
                          {s.price}
                        </p>
                        <p
                          className="text-[10px] font-bold"
                          style={{ color: "var(--tertiary)" }}
                        >
                          {s.trend}
                        </p>
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
          <Card
            padding="xl"
            className="md:col-span-2 space-y-5"
            style={{
              background: "var(--surface-container-low)",
              borderColor: "rgba(187,202,199,0.1)",
            }}
          >
            <h3
              className="text-2xl font-black"
              style={{ color: "var(--on-surface)" }}
            >
              Market Trends
            </h3>
            <p
              className="font-medium leading-relaxed"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Plate values have increased by 14% on average in Dubai over the
              last 12 months. Three-digit plates are seeing the highest
              liquidity.
            </p>
            <button
              className="flex items-center gap-2 text-sm font-black hover:underline"
              style={{ color: "var(--primary)" }}
            >
              View full market report <ArrowRight size={15} />
            </button>
          </Card>

          <Card
            padding="xl"
            className="relative overflow-hidden space-y-5"
            style={{
              background: "var(--teal-darker)",
              borderColor: "transparent",
            }}
          >
            <div className="relative z-10 space-y-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <ShieldCheck
                  size={22}
                  style={{ color: "var(--primary-container)" }}
                />
              </div>
              <h3 className="text-xl font-black text-white">
                Escrow Protection
              </h3>
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                All transactions secured via our UAE-based escrow system.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
