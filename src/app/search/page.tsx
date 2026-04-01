"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Lightbulb,
  Heart,
} from "lucide-react";
import PlateCard from "@/components/plates/PlateCard";
import { PLATES } from "@/lib/plates";
import type { Plate } from "@/types";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK"];
const DIGIT_OPTS = ["1", "2", "3", "4", "5"];

const inp = (style?: React.CSSProperties): React.CSSProperties => ({
  width: "100%",
  background: "var(--surface-container-low)",
  border: "none",
  borderRadius: 10,
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--on-surface)",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
  fontWeight: 500,
  appearance: "none",
  ...style,
});

export default function SearchPage() {
  const [sQ, setSQ] = useState("");
  const [sEm, setSEm] = useState("Dubai");
  const [sCode, setSCode] = useState("");
  const [sDig, setSDig] = useState("");
  const [adv, setAdv] = useState(false);
  const [searched, setSearched] = useState(false);

  const filtered: Plate[] = PLATES.filter((p) => {
    if (sEm && p.emirate !== sEm) return false;
    if (sCode && !p.code.toLowerCase().includes(sCode.toLowerCase()))
      return false;
    if (sDig && p.num.length !== parseInt(sDig)) return false;
    if (sQ) {
      const q = sQ.toLowerCase();
      if (
        !p.num.includes(q) &&
        !p.code.toLowerCase().includes(q) &&
        !p.emirate.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const reset = () => {
    setSEm("Dubai");
    setSCode("");
    setSDig("");
    setSQ("");
    setSearched(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ══════════════════════ MOBILE LAYOUT ══════════════════════ */}
      <div className="lg:hidden pb-28 px-4 pt-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-7">
          <div>
            <h2
              className="text-3xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Find a Plate
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Premium UAE assets explorer
            </p>
          </div>
          <button
            onClick={reset}
            className="text-sm font-semibold cursor-pointer bg-transparent border-none mb-1"
            style={{ color: "var(--primary)" }}
          >
            Reset
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--outline)" }}
            strokeWidth={1.8}
          />
          <input
            value={sQ}
            onChange={(e) => setSQ(e.target.value)}
            placeholder="Enter plate number..."
            style={{
              ...inp(),
              paddingLeft: 46,
              height: 56,
              fontSize: 16,
              borderRadius: 12,
              background: "var(--surface-container-lowest)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            {
              label: "EMIRATE",
              el: (
                <select
                  value={sEm}
                  onChange={(e) => setSEm(e.target.value)}
                  style={inp()}
                >
                  <option value="">Any</option>
                  {EMIRATES.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              ),
            },
            {
              label: "CODE",
              el: (
                <input
                  value={sCode}
                  onChange={(e) => setSCode(e.target.value)}
                  placeholder="All"
                  style={inp()}
                />
              ),
            },
            {
              label: "DIGITS",
              el: (
                <select
                  value={sDig}
                  onChange={(e) => setSDig(e.target.value)}
                  style={inp()}
                >
                  <option value="">Any</option>
                  {DIGIT_OPTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              ),
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label
                className="text-[9px] font-black uppercase tracking-[2px] ml-1"
                style={{ color: "var(--outline)" }}
              >
                {f.label}
              </label>
              <div className="relative">
                {f.el}
                {(i === 0 || i === 2) && (
                  <ChevronDown
                    size={12}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--on-surface-variant)" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Search Toggle */}
        <div className="flex items-center justify-between py-2 mb-3">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--on-surface)" }}
          >
            Advanced Search
          </span>
          <button
            onClick={() => setAdv(!adv)}
            className="cursor-pointer"
            style={{
              width: 40,
              height: 22,
              borderRadius: 11,
              background: adv
                ? "var(--primary)"
                : "var(--surface-container-high)",
              border: "none",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: adv ? 20 : 3,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            />
          </button>
        </div>

        {/* Search Button */}
        <button
          onClick={() => setSearched(true)}
          className="w-full h-14 rounded-xl font-black text-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
            color: "white",
          }}
        >
          Search Plates <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        {/* Results */}
        <div className="mt-10">
          <div className="flex items-baseline gap-2 mb-5">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--on-surface)" }}
            >
              {searched ? "Search Results" : "Recent Listings"}
            </h3>
            <span className="text-sm" style={{ color: "var(--outline)" }}>
              {searched
                ? `${filtered.length} plates found`
                : "128 plates found"}
            </span>
          </div>

          {searched && filtered.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <p className="font-medium">No plates found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3.5">
                {(searched ? filtered : PLATES.slice(0, 4)).map((p, i) => (
                  <PlateCard key={p.id} plate={p} index={i} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <button
                  className="px-8 h-12 rounded-xl font-bold cursor-pointer transition-colors"
                  style={{
                    background: "var(--surface-container-high)",
                    color: "var(--primary)",
                    border: "none",
                  }}
                >
                  View More Results
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════ DESKTOP LAYOUT ══════════════════════ */}
      <div className="hidden lg:block max-w-[760px] mx-auto px-6 py-8">
        {/* Search Card */}
        <section
          className="rounded-2xl p-6 mb-10"
          style={{
            background: "var(--surface-container-lowest)",
            boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
          }}
        >
          <div className="flex justify-between items-end mb-6">
            <h2
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Find a Plate
            </h2>
            <button
              onClick={reset}
              className="text-sm font-semibold cursor-pointer bg-transparent border-none"
              style={{ color: "var(--primary)" }}
            >
              Reset
            </button>
          </div>

          {/* Search input */}
          <div className="relative mb-5">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--outline)" }}
              strokeWidth={1.8}
            />
            <input
              value={sQ}
              onChange={(e) => setSQ(e.target.value)}
              placeholder="Search by number, birthday, lucky digits..."
              style={{
                ...inp(),
                paddingLeft: 46,
                height: 52,
                borderRadius: 12,
              }}
            />
          </div>

          {/* Filter row */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              {
                label: "EMIRATE",
                el: (
                  <select
                    value={sEm}
                    onChange={(e) => setSEm(e.target.value)}
                    style={inp()}
                  >
                    <option value="">Any Emirate</option>
                    {EMIRATES.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                ),
                hasChevron: true,
              },
              {
                label: "CODE / LETTER",
                el: (
                  <input
                    value={sCode}
                    onChange={(e) => setSCode(e.target.value)}
                    placeholder="e.g. R, AA, 12"
                    style={inp()}
                  />
                ),
              },
              {
                label: "DIGITS COUNT",
                el: (
                  <select
                    value={sDig}
                    onChange={(e) => setSDig(e.target.value)}
                    style={inp()}
                  >
                    <option value="">Any digits</option>
                    {DIGIT_OPTS.map((d) => (
                      <option key={d}>
                        {d} Digit{d !== "1" ? "s" : ""}
                      </option>
                    ))}
                  </select>
                ),
                hasChevron: true,
              },
            ].map((f, i) => (
              <div key={i} className="space-y-1.5">
                <label
                  className="block text-[10px] font-black uppercase tracking-[2px] ml-0.5"
                  style={{ color: "var(--outline)" }}
                >
                  {f.label}
                </label>
                <div className="relative">
                  {f.el}
                  {f.hasChevron && (
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--on-surface-variant)" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Smart search tip */}
          <div
            className="rounded-xl p-4 flex items-start gap-3 mb-5"
            style={{ background: "var(--surface-container-low)" }}
          >
            <Lightbulb
              size={18}
              strokeWidth={1.8}
              style={{ color: "var(--primary)", flexShrink: 0, marginTop: 1 }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <span
                className="font-bold"
                style={{ color: "var(--on-surface)" }}
              >
                Smart search:
              </span>{" "}
              try your birthday (DDMM) or lucky digits. Our system prioritizes
              meaningful combinations automatically.
            </p>
          </div>

          <button
            onClick={() => setSearched(true)}
            className="w-full py-4 rounded-xl font-black text-lg cursor-pointer transition-all active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
              color: "white",
              border: "none",
            }}
          >
            Search Plates
          </button>
        </section>

        {/* Results */}
        {(searched || true) && (
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--outline)" }}
              >
                {searched
                  ? `${filtered.length} plates found`
                  : "32 plates found"}
              </span>
              <div
                className="flex items-center gap-1 text-sm font-semibold cursor-pointer"
                style={{ color: "var(--primary)" }}
              >
                Sort by: Relevance <ChevronDown size={14} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(searched ? filtered : PLATES).map((p, i) => (
                <PlateCard key={p.id} plate={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
