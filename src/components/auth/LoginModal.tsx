"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { X, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
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
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string }).message ?? "Something went wrong";
      setError(formatFirebaseError(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string }).message ?? "Google sign-in failed";
      setError(formatFirebaseError(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl overflow-hidden"
        style={{ background: "var(--surface-container-low)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--surface-container)" }}
        >
          <div>
            <h2
              className="text-lg font-black"
              style={{ color: "var(--on-surface)" }}
            >
              Welcome to Madmoon
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Number Plate Marketplace
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex mx-6 mt-5 rounded-xl p-1 gap-1"
          style={{ background: "var(--surface-container)" }}
        >
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                clearError();
              }}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize",
                tab === t ? "text-white shadow-sm" : "",
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

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="px-6 pt-5 pb-6 space-y-3">
          {tab === "register" && (
            <div className="relative">
              <User
                size={16}
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
              size={16}
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
              size={16}
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
              style={{ background: "rgba(186,26,26,0.08)", color: "#BA1A1A" }}
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

          <div className="flex items-center gap-3 my-1">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--surface-container)" }}
            />
            <span className="text-xs" style={{ color: "var(--outline)" }}>
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--surface-container)" }}
            />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-60"
            style={{
              background: "var(--surface-container)",
              color: "var(--on-surface)",
              border: "1px solid var(--surface-container-highest)",
            }}
          >
            {/* Google SVG icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

function formatFirebaseError(msg: string): string {
  if (
    msg.includes("user-not-found") ||
    msg.includes("wrong-password") ||
    msg.includes("invalid-credential")
  )
    return "Invalid email or password.";
  if (msg.includes("email-already-in-use"))
    return "An account with this email already exists.";
  if (msg.includes("weak-password"))
    return "Password must be at least 6 characters.";
  if (msg.includes("invalid-email"))
    return "Please enter a valid email address.";
  if (msg.includes("popup-closed-by-user"))
    return "Sign-in popup was closed. Please try again.";
  if (msg.includes("network-request-failed"))
    return "Network error. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}
