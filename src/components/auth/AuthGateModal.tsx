"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Gavel,
  X,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import PlateViz from "@/components/plates/PlateViz";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";

/* ── Page-aware copy ──────────────────────────────────────────── */
interface PageMeta {
  headline: string;
  sub: string;
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
}

const PAGE_META: Record<string, PageMeta> = {
  search: {
    headline: "Discover UAE Plates",
    sub: "Browse thousands of verified listings from all seven Emirates.",
    icon: BadgeCheck,
    accentColor: "#2563EB",
    accentBg: "rgba(37,99,235,0.12)",
  },
  auctions: {
    headline: "Live Auctions",
    sub: "Bid on exclusive single-digit plates in real time.",
    icon: Gavel,
    accentColor: "#DC2626",
    accentBg: "rgba(220,38,38,0.12)",
  },
  estimator: {
    headline: "Plate Estimator",
    sub: "Get an AI-powered market valuation in seconds.",
    icon: TrendingUp,
    accentColor: "#D97706",
    accentBg: "rgba(217,119,6,0.12)",
  },
  plates: {
    headline: "Plate Details",
    sub: "View full history, bid, and initiate a secure transfer.",
    icon: ShieldCheck,
    accentColor: "var(--primary)",
    accentBg: "rgba(0,106,102,0.12)",
  },
  gift: {
    headline: "Gift a Plate",
    sub: "Send a prestigious UAE plate as a digital gift.",
    icon: ShieldCheck,
    accentColor: "#7C3AED",
    accentBg: "rgba(124,58,237,0.12)",
  },
};

function getMeta(href: string): PageMeta {
  const seg = href.split("/").filter(Boolean)[0] ?? "";
  return (
    PAGE_META[seg] ?? {
      headline: "Sign in to Continue",
      sub: "Access your plates, bids, and secure transfers.",
      icon: ShieldCheck,
      accentColor: "var(--primary)",
      accentBg: "rgba(0,106,102,0.12)",
    }
  );
}

function formatError(msg: string): string {
  if (
    msg.includes("user-not-found") ||
    msg.includes("wrong-password") ||
    msg.includes("invalid-credential")
  )
    return "Incorrect email or password.";
  if (msg.includes("email-already-in-use"))
    return "This email is already registered.";
  if (msg.includes("weak-password"))
    return "Password must be at least 6 characters.";
  if (msg.includes("invalid-email"))
    return "Please enter a valid email address.";
  if (msg.includes("popup-closed")) return "Sign-in was cancelled.";
  return "Something went wrong. Please try again.";
}

/* ── Google SVG ───────────────────────────────────────────────── */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.581C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ── Props ────────────────────────────────────────────────────── */
interface Props {
  /** The href the user was trying to reach — drives copy & post-auth redirect */
  destinationHref: string;
  /** If provided, renders an X button / backdrop-click to dismiss */
  onClose?: () => void;
}

export default function AuthGateModal({ destinationHref, onClose }: Props) {
  const router = useRouter();
  const meta = getMeta(destinationHref);
  const Icon = meta.icon;

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  function onSuccess() {
    router.push(destinationHref);
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (name.trim())
          await updateProfile(cred.user, { displayName: name.trim() });
      }
      onSuccess();
    } catch (err: unknown) {
      setError(formatError((err as { message?: string }).message ?? ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onSuccess();
    } catch (err: unknown) {
      setError(formatError((err as { message?: string }).message ?? ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(6,20,19,0.7)", backdropFilter: "blur(12px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      {/* ── Card ──────────────────────────────────────────────── */}
      <div
        className="relative flex w-full sm:max-w-[480px] lg:max-w-[820px] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "95dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left panel — desktop only ──────────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[320px] shrink-0 p-10 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, var(--teal-darker) 0%, var(--primary) 100%)",
          }}
        >
          {/* Decorative glows */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.08]"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full opacity-[0.06]"
            style={{ background: "white" }}
          />

          {/* Brand */}
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-10">
              <span
                className="text-2xl font-black"
                style={{ color: "var(--primary-container)" }}
              >
                Sakk
              </span>
              <span className="text-2xl font-black text-white/80">UAE</span>
            </div>

            {/* Destination label */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase mb-5"
              style={{
                background: meta.accentBg,
                border: `1px solid ${meta.accentColor}40`,
              }}
            >
              <ArrowRight size={10} color="white" />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>
                {meta.headline}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              Sign in to unlock
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {meta.sub}
            </p>
          </div>

          {/* Plate viz */}
          <div className="relative my-8 flex flex-col gap-3">
            <div className="plate-shadow rotate-[-5deg]">
              <PlateViz
                code="A"
                num="1"
                emirate="Dubai"
                type="gold"
                size="lg"
              />
            </div>
            <div className="plate-shadow rotate-[3deg] translate-x-8 translate-y-2 opacity-70">
              <PlateViz
                code="B"
                num="555"
                emirate="Abu Dhabi"
                type="abudhabi"
                size="md"
              />
            </div>
          </div>

          {/* Trust row */}
          <div className="relative space-y-2.5">
            {[
              { icon: ShieldCheck, text: "RTA-verified transfers" },
              { icon: BadgeCheck, text: "Escrow-protected payments" },
              { icon: TrendingUp, text: "2,400+ active listings" },
            ].map(({ icon: I, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <I size={13} style={{ color: "var(--primary-container)" }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ──────────────────────────────────── */}
        <div
          className="flex-1 flex flex-col overflow-y-auto px-6 pt-8 pb-8 sm:px-8"
          style={{ background: "var(--surface-container-lowest)" }}
        >
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10"
              style={{
                background: "var(--surface-container)",
                color: "var(--on-surface-variant)",
              }}
            >
              <X size={16} />
            </button>
          )}

          {/* Mobile brand + dest pill */}
          <div className="lg:hidden mb-6 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span
                className="text-xl font-black"
                style={{ color: "var(--primary)" }}
              >
                Sakk
              </span>
              <span
                className="text-xl font-black"
                style={{ color: "var(--on-surface)" }}
              >
                UAE
              </span>
            </div>
            {/* Destination badge */}
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide"
              style={{ background: meta.accentBg, color: meta.accentColor }}
            >
              <Icon size={11} />
              {meta.headline}
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2
              className="text-xl font-black mb-1"
              style={{ color: "var(--on-surface)" }}
            >
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p
              className="text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {tab === "login"
                ? "Sign in to access your plates, bids & transfers."
                : "Join 15,000+ UAE plate investors today."}
            </p>
          </div>

          {/* Google — primary CTA */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3.5 mb-5 rounded-2xl text-sm font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              background: "white",
              color: "#1a1a1a",
              border: "1.5px solid var(--surface-container-high)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
          >
            {loading ? (
              <Loader2
                size={18}
                className="animate-spin"
                style={{ color: "var(--outline)" }}
              />
            ) : (
              <GoogleIcon size={18} />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--surface-container)" }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--outline)" }}
            >
              or use email
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--surface-container)" }}
            />
          </div>

          {/* Tab toggle */}
          <div
            className="flex rounded-xl p-1 gap-1 mb-5"
            style={{ background: "var(--surface-container)" }}
          >
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  clearError();
                }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize",
                )}
                style={{
                  background: tab === t ? "var(--primary)" : "transparent",
                  color: tab === t ? "#fff" : "var(--on-surface-variant)",
                }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {tab === "register" && (
              <label className="block">
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--outline)" }}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--surface-container)",
                      color: "var(--on-surface)",
                      border: "1px solid var(--surface-container-highest)",
                    }}
                  />
                </div>
              </label>
            )}

            <label className="block">
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--outline)" }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--surface-container)",
                    color: "var(--on-surface)",
                    border: "1px solid var(--surface-container-highest)",
                  }}
                />
              </div>
            </label>

            <label className="block">
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--outline)" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={
                    tab === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--surface-container)",
                    color: "var(--on-surface)",
                    border: "1px solid var(--surface-container-highest)",
                  }}
                />
              </div>
            </label>

            {error && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{
                  background: "rgba(186,26,26,0.08)",
                  color: "var(--error)",
                }}
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ background: "var(--primary)" }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Legal */}
          <p
            className="mt-6 text-[11px] text-center leading-relaxed"
            style={{ color: "var(--outline)" }}
          >
            By continuing you agree to our{" "}
            <a
              href="#"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
