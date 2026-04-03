"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import UserMenu from "@/components/auth/UserMenu";
import {
  ShieldCheck,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronRight,
  Gavel,
  Gift,
  ArrowRight,
  Menu,
  X,
  Check,
  Play,
} from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import Logo from "@/components/ui/Logo";
import { getPlates } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import type { FSPlate } from "@/types/firebase";

/* ── helpers ─────────────────────────────────────────────────── */
function aed(n: number) {
  return "AED " + n.toLocaleString();
}

const EMIRATES = [
  "All Emirates",
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "RAK",
  "Fujairah",
  "UAQ",
];

const EMIRATE_DOTS: Record<string, string> = {
  "All Emirates": "#94A3B8",
  Dubai: "#C9A84C",
  "Abu Dhabi": "#B22234",
  Sharjah: "#1A5C1A",
  Ajman: "#42526E",
  RAK: "#3B6E78",
  Fujairah: "#6F8183",
  UAQ: "#7E8A8C",
};

function EmirateSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-bold whitespace-nowrap border-none cursor-pointer"
        style={{
          background: "white",
          color: "var(--on-surface)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          minWidth: 160,
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: EMIRATE_DOTS[value] ?? "#94A3B8" }}
        />
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--outline)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 overflow-hidden rounded-[20px] py-1.5"
          style={{
            background: "var(--surface-container-lowest)",
            border: "1px solid rgba(187,202,199,0.2)",
            boxShadow: "0 12px 32px rgba(25,28,29,0.14)",
            minWidth: "100%",
          }}
        >
          {EMIRATES.map((em) => {
            const isActive = em === value;
            return (
              <button
                key={em}
                type="button"
                onClick={() => {
                  onChange(em);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors border-none cursor-pointer"
                style={{
                  background: isActive ? "rgba(0,106,102,0.08)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--on-surface)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: EMIRATE_DOTS[em] ?? "#94A3B8" }}
                  />
                  <span className="text-sm font-bold">{em}</span>
                </div>
                {isActive && (
                  <Check size={14} style={{ color: "var(--primary)" }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const TRUST_PILLARS = [
  {
    Icon: ShieldCheck,
    label: "Secured Payment",
    body: "Every buyer transfer lands in a protected platform escrow account before the ownership process begins.",
    color: "var(--primary)",
    bg: "rgba(0,106,102,0.08)",
  },
  {
    Icon: TrendingUp,
    label: "Fully Digital Transaction",
    body: "From listing discovery to payment proof and transfer status, the entire journey stays online and trackable.",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
  },
  {
    Icon: ShieldCheck,
    label: "Full Escrow Protection",
    body: "Funds are held until transfer is confirmed by authorities, then released to the seller with a full audit trail.",
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Browse",
    body: "Explore your curated collection of available assets from all seven Emirates.",
  },
  {
    n: "02",
    title: "Pay",
    body: "Send your transfer to the platform IBAN and upload payment confirmation.",
  },
  {
    n: "03",
    title: "Transfer",
    body: "Our team coordinates the authority-side transfer and keeps both parties updated.",
  },
  {
    n: "04",
    title: "Verify",
    body: "Ownership is confirmed by the relevant licensing authority.",
  },
  {
    n: "05",
    title: "Receive",
    body: "Once transfer is confirmed, funds are released and the digital title is complete.",
  },
];

const FAQS = [
  {
    q: "How does the escrow system work?",
    a: "Once payment is confirmed, the funds are held in Madmoon escrow until transfer is confirmed by authorities. Only then are funds released to the seller.",
  },
  {
    q: "Are there any hidden transfer fees?",
    a: "No hidden charges. The buyer sees the plate price and service fee, while the seller settles any RTA transfer charges separately.",
  },
  {
    q: "Can I buy a plate if I don't live in the UAE?",
    a: "Yes, all digital certificates remain a proper legal title once registered within our on-chain exchange framework. You will need a UAE representative or notary to book the assets. Contact our concierge for guidance.",
  },
  {
    q: "How long does a typical transfer take?",
    a: "Subject to digital RTA approval, most transfers are completed within 10-24 business hours once the payment is confirmed in escrow.",
  },
];

const STATS = [
  { value: "2.4K+", label: "ACTIVE LISTINGS" },
  { value: "AED 1.2B", label: "TRANSACTION VOLUME" },
  { value: "15,000+", label: "MEMBERS VERIFIED" },
  { value: "99.9%", label: "TRANSFER ACCURACY" },
];

/* ── FAQ accordion ───────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b cursor-pointer"
      style={{ borderColor: "rgba(187,202,199,0.2)" }}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between py-5 px-1 gap-4">
        <span
          className="text-sm font-bold"
          style={{ color: "var(--on-surface)" }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "var(--outline)",
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </div>
      {open && (
        <p
          className="px-1 pb-5 text-sm leading-relaxed"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [plates, setPlates] = useState<FSPlate[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchNum, setSearchNum] = useState("");
  const [searchEmirate, setSearchEmirate] = useState("All Emirates");

  useEffect(() => {
    getPlates({ limitCount: 4 }).then(setPlates);
  }, []);

  function navigate(href: string) {
    router.push(href);
  }

  function handleCTA() {
    navigate("/search");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search?q=${searchNum}&emirate=${searchEmirate}`);
  }

  return (
    <>
      {/* ── Desktop nav ───────────────────────────────────────── */}
      <header
        className="hidden lg:flex sticky top-0 z-50 items-center justify-between px-10 h-16"
        style={{
          background: "rgba(6,61,58,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <Logo size="sm" variant="dark" />
        </div>
        <nav className="flex items-center gap-8">
          {[
            { label: "Marketplace", href: "/search" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Estimates", href: "/estimator" },
            { label: "Auctions", href: "/auctions" },
            { label: "Gifting", href: "/plates/plate_003/gift" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() =>
                item.href.startsWith("#")
                  ? document
                      .querySelector(item.href)
                      ?.scrollIntoView({ behavior: "smooth" })
                  : navigate(item.href)
              }
              className="text-sm font-semibold transition-colors hover:text-white border-none bg-transparent cursor-pointer"
              style={{
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {user && <UserMenu variant="dark" />}
      </header>

      {/* ── Mobile header ─────────────────────────────────────── */}
      <header
        className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          background: "rgba(6,61,58,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div>
          <Logo size="sm" variant="dark" />
        </div>
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex flex-col pt-14"
          style={{
            background: "rgba(6,61,58,0.99)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex flex-col gap-1 px-6 py-8">
            {[
              { label: "Marketplace", href: "/search" },
              { label: "Estimates", href: "/estimator" },
              { label: "Auctions", href: "/auctions" },
              { label: "Gifting", href: "/plates/plate_003/gift" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.href);
                }}
                className="py-4 text-lg font-bold border-b text-left border-none bg-transparent cursor-pointer"
                style={{
                  color: "white",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleCTA();
              }}
              className="mt-6 w-full py-4 rounded-2xl text-base font-black border-none cursor-pointer"
              style={{
                background: "var(--primary-container)",
                color: "var(--teal-darker)",
              }}
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--teal-darker) 0%, var(--primary) 70%, #007a6f 100%)",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left copy */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-container)]" />
              Browse verified UAE listings
            </div>

            {/* Desktop headline */}
            <h1 className="hidden lg:block text-5xl xl:text-6xl font-black leading-[0.92] tracking-tighter text-white">
              Secured Payment.
              <br />
              Fully Digital{" "}
              <span style={{ color: "var(--primary-container)" }}>
                Transaction.
                <br />
                Full Escrow Protection.
              </span>
            </h1>

            {/* Mobile headline */}
            <h1 className="lg:hidden text-4xl font-black leading-[0.95] tracking-tighter text-white">
              Secured Payment.
              <br />
              Fully Digital{" "}
              <span style={{ color: "var(--primary-container)" }}>
                Transfer.
              </span>
            </h1>

            <p
              className="text-sm lg:text-base font-medium max-w-md mx-auto lg:mx-0"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              <span className="hidden lg:inline">
                Browse premium UAE plates with protected payments,
                authority-confirmed transfers, and a fully digital buyer
                journey.
              </span>
              <span className="lg:hidden">
                Browse rare UAE plates with protected payments and full escrow
                protection from start to finish.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-3.5 rounded-2xl text-sm font-bold border cursor-pointer w-full sm:w-auto"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                Browse Plates
              </button>
            </div>

            {/* Trust row */}
            <div className="hidden lg:flex items-center gap-5 pt-2">
              {["Secured Payment", "Fully Digital", "Authority Confirmed"].map(
                (t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <Check
                      size={13}
                      style={{ color: "var(--primary-container)" }}
                    />
                    {t}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Right – plate visuals */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Main plate */}
              <div className="plate-shadow rotate-[-4deg] translate-y-2">
                <PlateViz
                  code="D"
                  num="1 111"
                  emirate="Dubai"
                  type="gold"
                  size="lg"
                />
              </div>
              {/* Secondary plate */}
              <div className="plate-shadow mt-4 rotate-[3deg] translate-x-6 opacity-80">
                <PlateViz
                  code="A"
                  num="55"
                  emirate="Abu Dhabi"
                  type="abudhabi"
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Get Started in Seconds ────────────────────────────── */}
      <section
        className="hidden lg:block"
        style={{
          background: "var(--surface-container-low)",
          borderBottom: "1px solid var(--surface-container)",
        }}
      >
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Get Started in Seconds
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCTA}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer"
              style={{ background: "var(--primary)", color: "white" }}
            >
              <Search size={14} />
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      <div className="overflow-y-auto" style={{ background: "var(--surface)" }}>
        {/* ── Why Trust Sakk / Why the Exchange ──────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="text-center mb-10 lg:mb-14">
            <p
              className="text-[10px] font-black tracking-[0.25em] uppercase mb-2"
              style={{ color: "var(--primary)" }}
            >
              Our Commitment
            </p>
            <h2
              className="text-3xl lg:text-4xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              <span className="hidden lg:inline">Why Trust Madmoon?</span>
              <span className="lg:hidden">Why the Exchange?</span>
            </h2>
            <p
              className="mt-3 text-sm lg:text-base max-w-lg mx-auto"
              style={{ color: "var(--on-surface-variant)" }}
            >
              We provide institutional-grade transparency for the world&apos;s
              most unique alternative asset class.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_PILLARS.map(({ Icon, label, body, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "var(--surface-container-lowest)",
                  border: "1px solid var(--surface-container)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p
                    className="font-black text-sm mb-1"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trending Listings ───────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2
                className="text-2xl lg:text-3xl font-black tracking-tight"
                style={{ color: "var(--on-surface)" }}
              >
                Trending Listings
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--outline)" }}>
                Most viewed plates in the last 24 hours
              </p>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-1.5 self-start text-sm font-bold border-none bg-transparent cursor-pointer sm:self-auto"
              style={{ color: "var(--primary)" }}
            >
              View Marketplace <ChevronRight size={16} />
            </button>
          </div>

          {plates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {plates.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/plates/${p.id}`)}
                  className="plate-card rounded-2xl overflow-hidden"
                  style={{
                    background: "var(--surface-container-lowest)",
                    border: "1px solid var(--surface-container)",
                  }}
                >
                  <div className="p-4 flex flex-col items-center gap-3">
                    <div
                      className="w-full rounded-xl flex items-center justify-center py-4"
                      style={{ background: "var(--surface-container-low)" }}
                    >
                      <PlateViz
                        code={p.code}
                        num={p.num}
                        emirate={p.emirate}
                        type={p.type}
                        size="md"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{
                            background:
                              p.listingType === "auction"
                                ? "rgba(186,26,26,0.1)"
                                : "rgba(0,106,102,0.1)",
                            color:
                              p.listingType === "auction"
                                ? "var(--error)"
                                : "var(--primary)",
                          }}
                        >
                          {p.listingType === "auction"
                            ? "Live Auction"
                            : "Fixed Price"}
                        </span>
                      </div>
                      <p
                        className="font-black text-sm"
                        style={{ color: "var(--on-surface)" }}
                      >
                        {aed(p.price)}
                      </p>
                      {p.origPrice && p.origPrice > p.price && (
                        <p
                          className="text-xs line-through"
                          style={{ color: "var(--outline)" }}
                        >
                          {aed(p.origPrice)}
                        </p>
                      )}
                      <p
                        className="text-[10px] font-bold uppercase mt-1"
                        style={{ color: "var(--outline)" }}
                      >
                        {p.emirate} · {p.code}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl animate-pulse"
                  style={{ background: "var(--surface-container)" }}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Find Your Perfect Asset (desktop search) ────────── */}
        <section
          className="hidden lg:block py-14"
          style={{
            background: "var(--surface-container-low)",
            borderTop: "1px solid var(--surface-container)",
            borderBottom: "1px solid var(--surface-container)",
          }}
        >
          <div className="max-w-3xl mx-auto px-10 text-center">
            <h2
              className="text-2xl font-black mb-2"
              style={{ color: "var(--on-surface)" }}
            >
              Find Your Perfect Asset
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Search from thousands of UAE plates by number, code, or emirate
            </p>
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                placeholder="Enter number (e.g. 5, 1234, 88)"
                className="flex-1 rounded-xl px-5 py-3.5 text-sm border-none outline-none"
                style={{
                  background: "white",
                  color: "var(--on-surface)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              />
              <EmirateSelect
                value={searchEmirate}
                onChange={setSearchEmirate}
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black border-none cursor-pointer"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <Search size={16} /> Search
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-5">
              {["1 Digit", "2 Digits", "3 Digits", "4 Digits", "5 Digits"].map(
                (d) => (
                  <button
                    key={d}
                    onClick={() => navigate(`/search?digits=${d[0]}`)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border-none cursor-pointer transition-colors hover:border-[var(--primary)]"
                    style={{
                      background: "white",
                      color: "var(--on-surface-variant)",
                      border: "1px solid var(--surface-container)",
                    }}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── A Seamless, Secure Journey ───────────────────────── */}
        <section
          id="how-it-works"
          className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20"
        >
          <div className="text-center mb-12">
            <p
              className="text-[10px] font-black tracking-[0.25em] uppercase mb-2"
              style={{ color: "var(--primary)" }}
            >
              The Process
            </p>
            <h2
              className="text-3xl lg:text-4xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              <span className="hidden lg:inline">
                A Seamless, Secure Journey
              </span>
              <span className="lg:hidden">The Investing Path</span>
            </h2>
            <p
              className="mt-3 text-sm max-w-sm mx-auto"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <span className="hidden lg:inline">
                We&apos;ve streamlined the plate transfer process, eliminating
                paperwork and uncertainty.
              </span>
              <span className="lg:hidden">
                Join the exchange and access exclusive early-bird auctions.
              </span>
            </p>
          </div>

          {/* Desktop: horizontal steps */}
          <div className="hidden lg:flex items-start gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.n}
                className="flex-1 flex flex-col items-center text-center px-4 relative"
              >
                {i < PROCESS_STEPS.length - 1 && (
                  <div
                    className="absolute top-6 left-1/2 right-0 h-0.5"
                    style={{
                      background: "var(--surface-container-high)",
                      marginLeft: "24px",
                    }}
                  />
                )}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mb-4 relative z-10"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  {step.n}
                </div>
                <p
                  className="font-black text-sm mb-2"
                  style={{ color: "var(--on-surface)" }}
                >
                  {step.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical numbered list — all 5 steps */}
          <div className="lg:hidden space-y-5">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.n} className="flex items-start gap-4 relative">
                {i < PROCESS_STEPS.length - 1 && (
                  <div
                    className="absolute left-5 top-10 bottom-0 w-0.5"
                    style={{
                      background: "var(--surface-container-high)",
                      height: "calc(100% + 20px - 40px)",
                    }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 relative z-10"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  {step.n}
                </div>
                <div className="pt-1.5">
                  <p
                    className="font-black text-sm mb-0.5"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature Cards ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Premium Auctions */}
            <div
              className="rounded-3xl p-8 lg:p-10 flex flex-col justify-between min-h-[240px] cursor-pointer relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
              }}
              onClick={() => navigate("/auctions")}
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                style={{ background: "var(--primary)", filter: "blur(40px)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Gavel size={18} color="white" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    Premium Auctions
                  </span>
                </div>
                <p className="text-2xl font-black text-white leading-snug">
                  Exclusive monthly events for the UAE&apos;s rarest
                  single-digit numbers.
                </p>
              </div>
              <button
                className="self-start mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer"
                style={{ background: "white", color: "#0a0a0a" }}
              >
                <Play size={14} /> Register for Auction
              </button>
            </div>

            {/* Corporate Gifting */}
            <div
              className="rounded-3xl p-8 lg:p-10 flex flex-col justify-between min-h-[240px] cursor-pointer relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)",
              }}
              onClick={() => navigate("/plates/plate_003/gift")}
            >
              <div
                className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-10"
                style={{ background: "#7C3AED", filter: "blur(40px)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={18} color="white" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    Corporate Gifting
                  </span>
                </div>
                <p className="text-2xl font-black text-white leading-snug">
                  The ultimate gesture of prestige for high-value clients and
                  partners.
                </p>
              </div>
              <button
                className="self-start mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer"
                style={{ background: "white", color: "#1a0a2e" }}
              >
                <Gift size={14} /> Gift a Plate →
              </button>
            </div>
          </div>
        </section>

        {/* ── Own a Plate? CTA ──────────────────────────────────── */}
        <section
          className="mx-6 lg:mx-auto lg:max-w-7xl mb-14 lg:mb-20 rounded-3xl py-12 lg:py-16 px-8 lg:px-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, var(--teal-darker) 0%, var(--primary) 100%)",
          }}
        >
          <p
            className="text-[10px] font-black tracking-[0.25em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            FOR SELLERS
          </p>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
            Own a Plate? List It Securely.
          </h2>
          <p
            className="text-sm lg:text-base mb-8 max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            Reach our exclusive network of high net-worth collectors and get the
            true value for your asset with zero listing fees.
          </p>
          <button
            onClick={handleCTA}
            className="px-8 py-4 rounded-2xl text-base font-black border-none cursor-pointer inline-flex items-center gap-2"
            style={{ background: "white", color: "var(--teal-darker)" }}
          >
            Start Selling Today <ArrowRight size={18} />
          </button>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <section
          className="py-12 lg:py-16"
          style={{
            background: "var(--surface-container-low)",
            borderTop: "1px solid var(--surface-container)",
            borderBottom: "1px solid var(--surface-container)",
          }}
        >
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="space-y-1.5">
                <p
                  className="text-3xl lg:text-4xl font-black tracking-tighter"
                  style={{ color: "var(--on-surface)" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.18em]"
                  style={{ color: "var(--outline)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="text-center mb-10">
            <h2
              className="text-2xl lg:text-3xl font-black tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ── Get Started CTA (mobile) ──────────────────────────── */}
        <section
          className="lg:hidden mx-6 mb-8 rounded-3xl py-10 px-7 text-center"
          style={{ background: "var(--teal-darker)" }}
        >
          <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-3">
            Get Started in Seconds
          </p>
          <button
            onClick={handleCTA}
            className="flex items-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-black border-none cursor-pointer mx-auto"
            style={{ background: "white", color: "var(--teal-darker)" }}
          >
            <Search size={18} />
            Browse Marketplace
          </button>
        </section>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer
          style={{
            background: "var(--teal-darker)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
              {/* Brand */}
              <div className="col-span-2 lg:col-span-1">
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span
                    className="text-xl font-black"
                    style={{ color: "var(--primary-container)" }}
                  >
                    Madmoon
                  </span>
                  <span className="text-xl font-black text-white/70">UAE</span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  The premier digital exchange for rare UAE heritage number
                  plate investments.
                </p>
              </div>
              {/* Links */}
              {[
                {
                  heading: "Marketplace",
                  links: [
                    "Dubai Plates",
                    "Abu Dhabi",
                    "Sharjah",
                    "All Emirates",
                  ],
                },
                {
                  heading: "Features",
                  links: ["How It Works", "Estimator", "Auctions", "Gifting"],
                },
                {
                  heading: "Resources",
                  links: [
                    "About Us",
                    "Contact",
                    "Privacy Policy",
                    "Terms of Service",
                  ],
                },
              ].map((col) => (
                <div key={col.heading}>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.18em] mb-4"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="text-xs font-medium transition-colors hover:text-white"
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                          }}
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div
              className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                © 2026 Madmoon. The trusted digital marketplace for UAE plate
                investments.
              </p>
              <div className="flex items-center gap-5">
                {["Privacy", "Terms", "Contact"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-[11px] hover:text-white transition-colors"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
      {/* bottom padding for BottomNav on mobile */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
