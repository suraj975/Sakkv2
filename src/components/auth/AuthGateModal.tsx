"use client";

import { useState } from "react";
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
} from "lucide-react";
import { auth } from "@/lib/firebase";
import PlateViz from "@/components/plates/PlateViz";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";

/* ── Page-aware copy ──────────────────────────────────────────── */
interface PageMeta {
  headline: string;
  sub: string;
  Icon: React.ElementType;
}

const PAGE_META: Record<string, PageMeta> = {
  search: {
    headline: "Discover UAE Plates",
    sub: "Browse thousands of verified listings",
    Icon: BadgeCheck,
  },
  auctions: {
    headline: "Live Auctions",
    sub: "Bid on exclusive plates in real time",
    Icon: Gavel,
  },
  estimator: {
    headline: "Plate Estimator",
    sub: "Get AI-powered valuation in seconds",
    Icon: TrendingUp,
  },
  plates: {
    headline: "Plate Details",
    sub: "View full history, ownership and transfer options",
    Icon: ShieldCheck,
  },
  gift: {
    headline: "Gift a Plate",
    sub: "Send a prestigious UAE plate as a digital gift",
    Icon: ShieldCheck,
  },
  notifications: {
    headline: "Notifications",
    sub: "Stay up to date on bids, auctions and transfers",
    Icon: BadgeCheck,
  },
  profile: {
    headline: "Your Profile",
    sub: "Manage listings, bids and your account",
    Icon: User,
  },
};

function getMeta(pathname: string): PageMeta {
  const seg = pathname.split("/").filter(Boolean)[0] ?? "";
  return (
    PAGE_META[seg] ?? {
      headline: "Welcome Back",
      sub: "Sign in to access this page",
      Icon: ShieldCheck,
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

interface Props {
  pathname: string;
}

export default function AuthGateModal({ pathname }: Props) {
  const meta = getMeta(pathname);
  const { Icon } = meta;

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

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
      // auth state change will show page content automatically
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
    } catch (err: unknown) {
      setError(formatError((err as { message?: string }).message ?? ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch lg:items-center justify-center"
      style={{ background: "rgba(6,30,29,0.75)", backdropFilter: "blur(10px)" }}
    >
      <div className="flex w-full lg:w-auto lg:max-w-[820px] lg:mx-4 lg:rounded-3xl overflow-hidden shadow-2xl">
        {/* ── Left brand panel (desktop only) ─────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[340px] shrink-0 p-10 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, var(--teal-darker) 0%, var(--primary) 100%)",
          }}
        >
          {/* decorative circles */}
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full opacity-10"
            style={{ background: "white" }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 mb-10">
              <span
                className="text-2xl font-black"
                style={{ color: "var(--primary-container)" }}
              >
                Sakk
              </span>
              <span className="text-2xl font-black text-white/80">UAE</span>
            </div>

            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon size={22} color="white" />
            </div>
            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              {meta.headline}
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              {meta.sub}
            </p>
          </div>

          {/* Plate visual */}
          <div className="relative flex flex-col gap-3 my-8">
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

          {/* Trust pills */}
          <div className="relative space-y-2.5">
            {[
              { Icon: ShieldCheck, text: "RTA-verified transfers" },
              { Icon: BadgeCheck, text: "Escrow-protected payments" },
              { Icon: TrendingUp, text: "2,400+ active listings" },
            ].map(({ Icon: I, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <I size={14} style={{ color: "var(--primary-container)" }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ─────────────────────────────────── */}
        <div
          className="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-y-auto px-6 py-8 lg:px-8 lg:py-10"
          style={{ background: "var(--surface-container-lowest)" }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span
                className="text-2xl font-black"
                style={{ color: "var(--primary)" }}
              >
                Sakk
              </span>
              <span
                className="text-2xl font-black"
                style={{ color: "var(--on-surface)" }}
              >
                UAE
              </span>
            </div>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {meta.sub}
            </p>
          </div>

          {/* Headline */}
          <div className="mb-7">
            <h2
              className="text-xl lg:text-2xl font-black mb-1"
              style={{ color: "var(--on-surface)" }}
            >
              {tab === "login" ? "Sign in to continue" : "Create your account"}
            </h2>
            <p
              className="text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {tab === "login"
                ? "Access your plates, bids & transfers."
                : "Join 15,000+ UAE plate investors."}
            </p>
          </div>

          {/* Google CTA — primary */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3.5 mb-5 rounded-2xl text-sm font-black flex items-center justify-center gap-3 transition-all disabled:opacity-60 shadow-sm"
            style={{
              background: loading ? "var(--surface-container)" : "white",
              color: "var(--on-surface)",
              border: "1.5px solid var(--surface-container-high)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {loading ? (
              <Loader2
                size={18}
                className="animate-spin"
                style={{ color: "var(--outline)" }}
              />
            ) : (
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
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
              className="text-xs font-semibold"
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
            )}

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
              className="w-full py-3.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: "var(--primary)" }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Footer note */}
          <p
            className="mt-6 text-[11px] text-center leading-relaxed"
            style={{ color: "var(--outline)" }}
          >
            By continuing you agree to our{" "}
            <a
              href="#"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Terms of Service
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
