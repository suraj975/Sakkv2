"use client";

import { useState } from "react";
import { Search as SearchIcon, ChevronDown, Zap, X } from "lucide-react";
import PlateCard from "@/components/plates/PlateCard";
import { PLATES } from "@/lib/plates";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState("All");
  const [digits, setDigits] = useState("All");

  const filtered = PLATES.filter((p) => {
    const matchQ = !query || p.num.includes(query) || p.code.toLowerCase().includes(query.toLowerCase());
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
        <h1 className="text-lg lg:text-xl font-black tracking-tight" style={{ color: "var(--on-surface)" }}>
          Search Plates
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 pb-28 lg:pb-16">

        {/* Page Title */}
        <header className="space-y-4">
          <Badge size="md" className="!bg-[var(--teal-light)] !text-[var(--primary)] !border-none !px-4 !py-1.5 rounded-full">
            MARKETPLACE
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[0.95]" style={{ color: "var(--on-surface)" }}>
            Find your plate
          </h1>
        </header>

        {/* Search Card */}
        <Card padding="xl" className="space-y-7" style={{ boxShadow: "0 8px 28px rgba(25,28,29,0.08)" }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Search Number */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--outline)" }}>
                SEARCH NUMBER
              </label>
              <div className="relative">
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
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
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
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
              <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--outline)" }}>EMIRATE</label>
              <div className="relative">
                <select
                  value={emirate}
                  onChange={(e) => setEmirate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl text-base font-bold focus:outline-none transition-all appearance-none cursor-pointer"
                  style={{ background: "var(--surface-container-low)", border: "2px solid transparent", color: "var(--on-surface)", fontFamily: "inherit" }}
                >
                  <option>All</option>
                  <option>Dubai</option>
                  <option>Abu Dhabi</option>
                  <option>Sharjah</option>
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--outline)" }} />
              </div>
            </div>

            {/* Digits */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--outline)" }}>DIGITS</label>
              <div className="relative">
                <select
                  value={digits}
                  onChange={(e) => setDigits(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl text-base font-bold focus:outline-none transition-all appearance-none cursor-pointer"
                  style={{ background: "var(--surface-container-low)", border: "2px solid transparent", color: "var(--on-surface)", fontFamily: "inherit" }}
                >
                  <option>All</option>
                  <option value="1">1 Digit</option>
                  <option value="2">2 Digits</option>
                  <option value="3">3 Digits</option>
                  <option value="4">4 Digits</option>
                  <option value="5">5 Digits</option>
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--outline)" }} />
              </div>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between gap-5 pt-4"
            style={{ borderTop: "1px solid var(--surface-container)" }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--outline)" }}>
              <Zap size={15} fill="var(--primary)" style={{ color: "var(--primary)" }} />
              <span className="text-xs font-bold">Smart search: try "Dubai 786" or "4 digits"</span>
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
            <p className="text-sm font-bold" style={{ color: "var(--outline)" }}>
              Showing <span style={{ color: "var(--on-surface)" }}>{filtered.length} results</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--outline)" }}>SORT BY</span>
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
                <h3 className="text-xl font-black" style={{ color: "var(--on-surface)" }}>No plates found</h3>
                <p className="font-medium" style={{ color: "var(--on-surface-variant)" }}>Try adjusting your filters or search query.</p>
              </div>
              <Button variant="outline" onClick={() => { setQuery(""); setEmirate("All"); setDigits("All"); }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
