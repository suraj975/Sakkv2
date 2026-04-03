"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  MessageSquare,
  User2,
} from "lucide-react";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import PlateViz from "@/components/plates/PlateViz";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";

const fieldClass =
  "w-full rounded-[18px] border-none bg-[var(--surface-container-low)] px-4 py-4 text-[15px] text-[var(--on-surface)] outline-none placeholder:text-[var(--outline)]";

export default function GiftSetupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [loadingPlate, setLoadingPlate] = useState(true);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    getPlateById(id ?? "").then((p) => {
      setPlate(p);
      setLoadingPlate(false);
    });
  }, [id]);

  if (loadingPlate)
    return (
      <div
        className="flex-1 p-6 space-y-4"
        style={{ background: "var(--surface)" }}
      >
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-16 rounded-2xl" />
        <SkeletonBlock className="h-16 rounded-2xl" />
        <SkeletonBlock className="h-16 rounded-2xl" />
      </div>
    );
  if (!plate)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">🎁</span>
        <h2
          className="text-xl font-black"
          style={{ color: "var(--on-surface)" }}
        >
          Plate not found
        </h2>
        <button
          onClick={() => router.push("/search")}
          className="px-6 py-2.5 rounded-2xl text-sm font-bold cursor-pointer border-none"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Browse Plates
        </button>
      </div>
    );

  const handleContinue = () => {
    const params = new URLSearchParams({ name, msg, date });
    router.push(`/plates/${id}/gift/checkout?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--surface)]">
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-white px-4 shadow-[0_1px_0_rgba(187,202,199,0.18)]">
        <button
          onClick={() => router.push(`/plates/${id}/gift`)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-none bg-transparent text-[var(--primary)]"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-base font-black text-[var(--on-surface)]">
          Gift Details
        </span>
      </div>

      <div className="mx-auto max-w-md px-4 py-5 pb-8">
        <div
          className="rounded-[28px] px-5 py-6"
          style={{
            background: "linear-gradient(180deg, #133D3A 0%, #152F2F 100%)",
          }}
        >
          <div className="flex justify-center">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="md"
            />
          </div>
          <p className="mt-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-white/60">
            {plate.emirate} {plate.code} {plate.num}
          </p>
        </div>

        <div className="mt-5 rounded-[26px] bg-white p-5 shadow-[0_10px_36px_rgba(25,28,29,0.08)]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-[var(--outline)]">
                <User2 size={15} />
                Recipient&apos;s Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatima Al Rashid"
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-[var(--outline)]">
                <MessageSquare size={15} />
                Personal Message
              </label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Add a short message for the reveal"
                rows={5}
                maxLength={140}
                className={`${fieldClass} resize-none`}
              />
              <p className="mt-2 text-right text-[11px] font-semibold text-[var(--outline)]">
                {msg.length}/140
              </p>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-[var(--outline)]">
                <CalendarDays size={15} />
                Scheduled Delivery Date
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Optional"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div
          className="mt-5 rounded-[22px] px-4 py-4 text-[14px] leading-7"
          style={{
            background: "#F3FBFB",
            border: "1px solid rgba(12,191,184,0.16)",
            color: "var(--on-surface-variant)",
          }}
        >
          The recipient will receive a private reveal link and will need their
          TCF number to complete the transfer.
        </div>

        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="mt-5 flex h-16 w-full items-center justify-center gap-3 rounded-[16px] border-none text-[18px] font-black text-white"
          style={{
            background: name.trim()
              ? "linear-gradient(90deg, #0E7F79 0%, #1CC6C3 100%)"
              : "linear-gradient(90deg, #A9D7D5 0%, #CBE9E7 100%)",
            cursor: name.trim() ? "pointer" : "not-allowed",
          }}
        >
          <Gift size={20} />
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
