"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import { HelpCircle, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { getPlateById, aed } from "@/lib/plates";

const inp = (focused: boolean) => ({
  width: "100%",
  background: "var(--surface-container-low)",
  border: `2px solid ${focused ? "var(--primary)" : "transparent"}`,
  borderRadius: 12,
  padding: "13px 14px",
  fontSize: 14,
  color: "var(--on-surface)",
  boxSizing: "border-box" as const,
  outline: "none",
  fontFamily: "inherit",
});

function GiftRevealInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const plateId = searchParams.get("plateId") || "3";
  const from = searchParams.get("from") || "Someone special";
  const gMsg = searchParams.get("msg") || "";
  const plate = getPlateById(plateId);

  const [tcf, setTcf] = useState("");

  if (!plate)
    return (
      <div
        className="p-8 text-center"
        style={{ color: "var(--on-surface-variant)" }}
      >
        Gift not found.
      </div>
    );

  const tcfValid = tcf.length >= 6;

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--surface)" }}
    >
      {/* App header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(6,61,58,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <span
          className="text-[18px] font-black"
          style={{ color: "var(--primary-container)" }}
        >
          Sakk
        </span>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <HelpCircle size={18} color="rgba(255,255,255,0.7)" />
        </button>
      </div>

      {/* Dark teal hero */}
      <div
        className="px-5 py-10 text-center"
        style={{ background: "var(--teal-dark)" }}
      >
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 mb-5"
          style={{ border: "1.5px solid rgba(12,191,184,0.5)" }}
        >
          <span
            className="text-[11px] font-bold tracking-[1.5px]"
            style={{ color: "var(--primary-container)" }}
          >
            YOU RECEIVED A GIFT
          </span>
        </div>

        <div
          className="text-[13px] mb-1"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          From
        </div>
        <div className="text-[22px] font-black text-white mb-6">{from}</div>

        <div className="flex justify-center mb-5">
          <PlateViz
            code={plate.code}
            num={plate.num}
            emirate={plate.emirate}
            type={plate.type}
            size="lg"
          />
        </div>

        {gMsg && (
          <div
            className="text-[14px] italic"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            &ldquo;{gMsg}&rdquo;
          </div>
        )}
      </div>

      {/* Content cards */}
      <div className="px-4 py-5 lg:max-w-xl lg:mx-auto">
        {/* Plate value card */}
        <div
          className="rounded-2xl p-5 mb-3"
          style={{
            background: "var(--surface-container-lowest)",
            boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div
                className="text-[12px] mb-1"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Plate Value
              </div>
              <div
                className="text-[28px] font-black"
                style={{ color: "var(--on-surface)" }}
              >
                {aed(plate.price)}{" "}
                <span
                  className="text-[14px] font-bold"
                  style={{ color: "var(--tertiary)" }}
                >
                  ↗ +2.4%
                </span>
              </div>
            </div>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full mt-1"
              style={{
                background: "rgba(0,106,102,0.1)",
                color: "var(--primary)",
              }}
            >
              {plate.emirate.toUpperCase()} · CODE {plate.code}
            </span>
          </div>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--on-surface-variant)" }}
          >
            This digital asset is secured via Sakk Escrow and is ready for
            immediate transfer to your traffic file.
          </p>
        </div>
        {/* TCF input card */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: "var(--surface-container-lowest)",
            boxShadow: "0 4px 18px rgba(25,28,29,0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} style={{ color: "var(--primary)" }} />
            <span
              className="text-[15px] font-bold"
              style={{ color: "var(--on-surface)" }}
            >
              Enter your TCF Number
            </span>
          </div>
          <p
            className="text-[12px] leading-relaxed mb-4"
            style={{ color: "var(--on-surface-variant)" }}
          >
            To accept this gift, please provide your Traffic Code Number (TCF).
            This allows us to initiate the legal ownership transfer via the RTA
            portal.
          </p>

          <div className="relative">
            <input
              value={tcf}
              onChange={(e) => setTcf(e.target.value)}
              placeholder="7729103"
              className="w-full rounded-xl px-4 py-3 text-[14px]"
              style={{
                ...inp(tcfValid || tcf.length > 0),
                paddingRight: tcfValid ? 48 : 16,
              }}
            />
            {tcfValid && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <CheckCircle2 size={14} color="white" />
              </div>
            )}
          </div>

          {tcfValid && (
            <div
              className="text-[11px] mt-1.5 font-semibold"
              style={{ color: "var(--primary)" }}
            >
              ✓ VALID
            </div>
          )}

          <p
            className="text-[11px] mt-3"
            style={{ color: "var(--on-surface-variant)", opacity: 0.7 }}
          >
            You can find your TCF on your vehicle registration card or MOI app.
          </p>
        </div>

        {/* Accept button */}
        <button
          onClick={() => router.push(`/plates/${plate.id}/checkout/complete`)}
          disabled={!tcfValid}
          className="w-full border-none rounded-2xl py-4 text-[16px] font-bold text-white mb-3"
          style={{
            background: tcfValid
              ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)"
              : "var(--surface-container)",
            color: tcfValid ? "white" : "var(--on-surface-variant)",
            cursor: tcfValid ? "pointer" : "not-allowed",
            boxShadow: tcfValid ? "0 4px 16px rgba(0,106,102,0.35)" : "none",
          }}
        >
          Accept Gift &amp; Start Transfer
        </button>

        {/* Decline */}
        <button
          className="w-full border-none bg-transparent py-2 text-[14px] font-semibold cursor-pointer"
          style={{ color: "var(--primary)" }}
        >
          Decline Gift
        </button>
      </div>

      {/* Footer bar */}
      <div
        className="px-5 py-4 flex items-center gap-3 mt-4"
        style={{ borderTop: "1px solid var(--surface-container)" }}
      >
        <ShieldCheck
          size={20}
          style={{ color: "var(--primary)", flexShrink: 0 }}
        />
        <div>
          <div
            className="text-[13px] font-semibold"
            style={{ color: "var(--on-surface)" }}
          >
            100% Escrow Safe
          </div>
          <div
            className="text-[11px]"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Funds and assets are held in secure escrow until transfer is
            verified by RTA.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftRevealPage() {
  return (
    <Suspense>
      <GiftRevealInner />
    </Suspense>
  );
}
