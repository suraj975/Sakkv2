"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Copy,
  Landmark,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { aed, escrowFee } from "@/lib/plates";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";

const PLATFORM_BANK = {
  accountName: "Madmoon Escrow Collection Account",
  bankName: "Emirates NBD",
  iban: "AE07 0260 0000 1234 5678 901",
  swift: "EBILAEAD",
};

export default function BankTransferPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    getPlateById(id ?? "").then((p) => {
      setPlate(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        style={{ color: "var(--outline)" }}
      >
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (!plate) return notFound();

  const fee = escrowFee(plate.price);
  const total = plate.price + fee;
  const txRef = `MDM-${String(plate.id ?? id)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()}-2401`;

  function simulateTransfer() {
    setSimulating(true);
    setTimeout(() => {
      router.push(`/plates/${id}/checkout/escrow`);
    }, 1200);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--surface)]">
      <header
        className="sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 lg:h-16 lg:px-8"
        style={{
          borderColor: "rgba(187,202,199,0.15)",
          background: "rgba(248,250,251,0.88)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-transparent"
          style={{ color: "var(--on-surface)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <span
          className="text-sm font-black lg:text-base"
          style={{ color: "var(--primary)" }}
        >
          Bank Transfer Details
        </span>
        <div className="w-10" />
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28 lg:px-8 lg:py-8">
        <div className="space-y-2">
          <p
            className="text-[11px] font-black uppercase tracking-[0.18em]"
            style={{ color: "var(--outline)" }}
          >
            Step 2 of 3
          </p>
          <h1
            className="text-2xl font-black lg:text-3xl"
            style={{ color: "var(--on-surface)" }}
          >
            Transfer to the platform IBAN
          </h1>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            Send the full amount below to the Madmoon escrow account. Once your
            transfer is sent, continue to step 3.
          </p>
        </div>

        <Card padding="lg" className="space-y-4">
          <div className="flex justify-center">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="md"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--surface-container-low)] px-4 py-3">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.18em]"
                style={{ color: "var(--outline)" }}
              >
                Total to transfer
              </p>
              <p
                className="mt-1 text-2xl font-black"
                style={{ color: "var(--primary)" }}
              >
                {aed(total)}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-[10px] font-black uppercase tracking-[0.18em]"
                style={{ color: "var(--outline)" }}
              >
                Reference
              </p>
              <p
                className="mt-1 text-sm font-black"
                style={{ color: "var(--on-surface)" }}
              >
                {txRef}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(0,106,102,0.08)]">
              <Landmark size={20} className="text-[var(--primary)]" />
            </div>
            <div>
              <p
                className="text-lg font-black"
                style={{ color: "var(--on-surface)" }}
              >
                Platform receiving account
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Use the exact IBAN below when sending your bank transfer.
              </p>
            </div>
          </div>

          {[
            { label: "Account name", value: PLATFORM_BANK.accountName },
            { label: "Bank", value: PLATFORM_BANK.bankName },
            { label: "IBAN", value: PLATFORM_BANK.iban, mono: true },
            { label: "SWIFT", value: PLATFORM_BANK.swift, mono: true },
            { label: "Payment reference", value: txRef, mono: true },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--surface-container-low)] px-4 py-3"
            >
              <div className="min-w-0">
                <p
                  className="text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{ color: "var(--outline)" }}
                >
                  {row.label}
                </p>
                <p
                  className={`mt-1 text-sm font-bold ${row.mono ? "font-mono" : ""}`}
                  style={{ color: "var(--on-surface)" }}
                >
                  {row.value}
                </p>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-none bg-white"
                style={{ color: "var(--on-surface-variant)" }}
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </Card>

        <div
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            background: "rgba(0,106,102,0.06)",
            border: "1px solid rgba(0,106,102,0.12)",
          }}
        >
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[var(--primary)]"
          />
          <div>
            <p
              className="text-sm font-black"
              style={{ color: "var(--primary)" }}
            >
              Protected transfer
            </p>
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Funds are held until transfer is confirmed by authorities. The
              seller pays any RTA charges separately.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            size="xl"
            className="w-full !rounded-2xl !py-4 !text-base !font-black"
            isLoading={simulating}
            onClick={simulateTransfer}
          >
            Simulate Transfer Sent
          </Button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-none bg-[var(--surface-container-low)] py-4 text-sm font-bold"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Building2 size={16} />
            I&apos;ll transfer later
          </button>
        </div>
      </div>
    </div>
  );
}
