"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search as SearchIcon,
  ChevronDown,
  Zap,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import PlateCard from "@/components/plates/PlateCard";
import { getPlates } from "@/lib/firestore";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { FSPlate } from "@/types/firebase";

const EMIRATE_OPTIONS = [
  { value: "All", label: "All Emirates", short: "ALL", dot: "#94A3B8" },
  { value: "Dubai", label: "Dubai", short: "DXB", dot: "#FACC15" },
  { value: "Abu Dhabi", label: "Abu Dhabi", short: "AUH", dot: "#DC2626" },
  { value: "Sharjah", label: "Sharjah", short: "SHJ", dot: "#15803D" },
  { value: "Ajman", label: "Ajman", short: "AJM", dot: "#1F2937" },
  { value: "UAQ", label: "Umm Al Quwain", short: "UAQ", dot: "#7C8B8C" },
  { value: "RAK", label: "Ras Al Khaimah", short: "RAK", dot: "#3F7C7A" },
  { value: "Fujairah", label: "Fujairah", short: "FUJ", dot: "#6B7C7D" },
];

const DIGIT_OPTIONS = [
  { value: "All", label: "All", short: "ALL" },
  { value: "1", label: "1 Digit", short: "1D" },
  { value: "2", label: "2 Digits", short: "2D" },
  { value: "3", label: "3 Digits", short: "3D" },
  { value: "4", label: "4 Digits", short: "4D" },
  { value: "5", label: "5 Digits", short: "5D" },
];

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
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-bold"
          style={{
            background: "var(--surface-container-low)",
            color: "var(--on-surface)",
            boxShadow: desktopOpen ? "0 0 0 2px rgba(0,106,102,0.2)" : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: active.dot }}
            />
            <span>{active.label}</span>
          </div>
          <ChevronDown
            size={16}
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
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: item.dot }}
                    />
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
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-bold md:hidden"
        style={{
          background: "var(--surface-container-low)",
          color: "var(--on-surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: active.dot }}
          />
          <span>{active.label}</span>
        </div>
        <SlidersHorizontal size={16} style={{ color: "var(--outline)" }} />
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

function DigitsPicker({
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
      DIGIT_OPTIONS.find((item) => item.value === value) ?? DIGIT_OPTIONS[0],
    [value],
  );

  return (
    <>
      <div ref={ref} className="relative hidden md:block">
        <button
          type="button"
          onClick={() => setDesktopOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-bold"
          style={{
            background: "var(--surface-container-low)",
            color: "var(--on-surface)",
            boxShadow: desktopOpen ? "0 0 0 2px rgba(0,106,102,0.2)" : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black"
              style={{
                background: "rgba(0,106,102,0.12)",
                color: "var(--primary)",
              }}
            >
              {active.short}
            </span>
            <span>{active.label}</span>
          </div>
          <ChevronDown
            size={16}
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
            {DIGIT_OPTIONS.map((item) => {
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
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black"
                      style={{
                        background: isActive
                          ? "rgba(0,106,102,0.14)"
                          : "rgba(148,163,184,0.12)",
                        color: isActive
                          ? "var(--primary)"
                          : "var(--on-surface-variant)",
                      }}
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
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-bold md:hidden"
        style={{
          background: "var(--surface-container-low)",
          color: "var(--on-surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black"
            style={{
              background: "rgba(0,106,102,0.12)",
              color: "var(--primary)",
            }}
          >
            {active.short}
          </span>
          <span>{active.label}</span>
        </div>
        <SlidersHorizontal size={16} style={{ color: "var(--outline)" }} />
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
                Select Digits
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
              {DIGIT_OPTIONS.map((item) => {
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
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-[13px] font-black"
                        style={{
                          background: isActive
                            ? "var(--primary)"
                            : "rgba(148,163,184,0.12)",
                          color: isActive
                            ? "white"
                            : "var(--on-surface-variant)",
                        }}
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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState("All");
  const [digits, setDigits] = useState("All");
  const [allPlates, setAllPlates] = useState<FSPlate[]>([]);

  useEffect(() => {
    getPlates({ limitCount: 50, listingType: "fixed" })
      .then(setAllPlates)
      .catch(console.error);
  }, []);

  const filtered = allPlates.filter((p) => {
    const matchQ =
      !query ||
      p.num.includes(query) ||
      p.code.toLowerCase().includes(query.toLowerCase());
    const matchE = emirate === "All" || p.emirate === emirate;
    const matchD = digits === "All" || p.num.length.toString() === digits;
    return matchQ && matchE && matchD;
  });

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
          Search Plates
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 pb-28 lg:pb-16">
        {/* Page Title */}
        <header className="space-y-4">
          <Badge
            size="md"
            className="!bg-[var(--teal-light)] !text-[var(--primary)] !border-none !px-4 !py-1.5 rounded-full"
          >
            MARKETPLACE
          </Badge>
          <h1
            className="text-4xl lg:text-6xl font-black tracking-tight leading-[0.95]"
            style={{ color: "var(--on-surface)" }}
          >
            Find your plate
          </h1>
        </header>

        {/* Search Card */}
        <Card
          padding="xl"
          className="space-y-7"
          style={{ boxShadow: "0 8px 28px rgba(25,28,29,0.08)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Search Number */}
            <div className="md:col-span-5 space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--outline)" }}
              >
                SEARCH NUMBER
              </label>
              <div className="relative">
                <SearchIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--outline)" }}
                />
                <input
                  type="text"
                  placeholder="e.g. 786, 1234..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl text-base font-bold focus:outline-none transition-all"
                  style={{
                    background: "var(--surface-container-low)",
                    border: "2px solid transparent",
                    color: "var(--on-surface)",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--outline)" }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Emirate */}
            <div className="md:col-span-3 space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--outline)" }}
              >
                EMIRATE
              </label>
              <EmiratePicker value={emirate} onChange={setEmirate} />
            </div>

            {/* Digits */}
            <div className="md:col-span-4 space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--outline)" }}
              >
                DIGITS
              </label>
              <DigitsPicker value={digits} onChange={setDigits} />
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between gap-5 pt-4"
            style={{ borderTop: "1px solid var(--surface-container)" }}
          >
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--outline)" }}
            >
              <Zap
                size={15}
                fill="var(--primary)"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-xs font-bold">
                Smart search: try &quot;A 1234&quot; or &quot;Dubai 786&quot;
              </span>
            </div>
            <Button
              className="w-full md:w-auto !px-12 !py-3.5 !text-base !font-black !rounded-2xl"
              style={{ boxShadow: "0 6px 20px rgba(0,106,102,0.25)" }}
            >
              Search Plates
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <p
              className="text-sm font-bold"
              style={{ color: "var(--outline)" }}
            >
              Showing{" "}
              <span style={{ color: "var(--on-surface)" }}>
                {filtered.length} results
              </span>
            </p>
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--outline)" }}
              >
                SORT BY
              </span>
              <select
                className="bg-transparent text-sm font-black focus:outline-none cursor-pointer"
                style={{ color: "var(--on-surface)", fontFamily: "inherit" }}
              >
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((plate, i) => (
                <PlateCard key={plate.id} plate={plate} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "var(--surface-container-low)" }}
              >
                <SearchIcon size={36} style={{ color: "var(--outline)" }} />
              </div>
              <div className="space-y-2">
                <h3
                  className="text-xl font-black"
                  style={{ color: "var(--on-surface)" }}
                >
                  No plates found
                </h3>
                <p
                  className="font-medium"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Try adjusting your filters or search query.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setEmirate("All");
                  setDigits("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
