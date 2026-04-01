"use client";

import { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import PageHeader from "@/components/layout/PageHeader";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";
import { Loader2 } from "lucide-react";

const inp = {
  width: "100%",
  background: "var(--sakk-card)",
  border: "1px solid var(--sakk-border)",
  borderRadius: 10,
  padding: "11px",
  fontSize: 13,
  color: "var(--sakk-text)",
  boxSizing: "border-box" as const,
  outline: "none",
  fontFamily: "inherit",
};

const FIELDS = [
  {
    key: "name",
    label: "Recipient's Full Name",
    ph: "e.g. Fatima Al Rashid",
    area: false,
    req: true,
  },
  {
    key: "msg",
    label: "Personal Message",
    ph: "e.g. Happy Birthday!",
    area: true,
    req: false,
  },
  {
    key: "date",
    label: "Scheduled Delivery Date (optional)",
    ph: "e.g. 15 March 2025",
    area: false,
    req: false,
  },
] as const;

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
        className="flex-1 flex items-center justify-center"
        style={{ color: "var(--outline)" }}
      >
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  if (!plate) return notFound();

  const values: Record<string, string> = { name, msg, date };
  const setters: Record<string, (v: string) => void> = {
    name: setName,
    msg: setMsg,
    date: setDate,
  };

  const handleContinue = () => {
    const params = new URLSearchParams({ name, msg, date });
    router.push(`/plates/${id}/gift/checkout?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader title="Gift Details" backHref={`/plates/${id}/gift`} />

      <div className="p-4 lg:px-6">
        <div className="max-w-[600px] mx-auto">
          <div className="flex justify-center mb-4">
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="md"
            />
          </div>

          <div
            className="rounded-2xl px-4 pt-3 pb-1 mb-4"
            style={{
              background: "var(--sakk-card)",
              border: "1px solid var(--sakk-border)",
            }}
          >
            {FIELDS.map((f) => (
              <div key={f.key} className="mb-3.5">
                <div
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "var(--sakk-text2)" }}
                >
                  {f.label}
                  {f.req && <span style={{ color: "var(--teal)" }}> *</span>}
                </div>
                {f.area ? (
                  <div className="relative">
                    <textarea
                      value={values[f.key]}
                      onChange={(e) => setters[f.key](e.target.value)}
                      placeholder={f.ph}
                      rows={3}
                      maxLength={140}
                      style={{ ...inp, resize: "none" }}
                    />
                    <span
                      className="absolute bottom-2 right-3 text-[10px]"
                      style={{ color: "var(--sakk-text3)" }}
                    >
                      {values[f.key].length}/140
                    </span>
                  </div>
                ) : (
                  <input
                    value={values[f.key]}
                    onChange={(e) => setters[f.key](e.target.value)}
                    placeholder={f.ph}
                    style={inp}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!name}
            className="w-full border-none rounded-xl py-3.5 text-sm font-semibold text-white cursor-pointer mb-3"
            style={{
              background: name ? "var(--teal)" : "#C0E8E6",
              cursor: name ? "pointer" : "not-allowed",
            }}
          >
            Continue to Payment →
          </button>

          <div
            className="rounded-xl px-3 py-2.5 mb-4 text-[11px] leading-relaxed"
            style={{
              background: "#FFFBEB",
              border: "1px solid #FCD34D",
              borderLeft: "4px solid #D97706",
              color: "#78450A",
            }}
          >
            The recipient will need to provide their TCF (Traffic Code File)
            number to complete the transfer. We&apos;ll guide them step by step.
          </div>
        </div>
      </div>
    </div>
  );
}
