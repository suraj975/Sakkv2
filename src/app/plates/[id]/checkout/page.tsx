"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PlateViz from "@/components/plates/PlateViz";
import {
  ArrowLeft,
  Lock,
  Building2,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";
import { aed, escrowFee } from "@/lib/plates";
import { getPlateById } from "@/lib/firestore";
import type { FSPlate } from "@/types/firebase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  {
    id: "bank",
    label: "Bank Transfer",
    sub: "Instant via UAE Central Bank",
    Icon: Building2,
  },
];

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plate, setPlate] = useState<FSPlate | null>(null);
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState("bank");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getPlateById(id ?? "").then((p) => {
      setPlate(p);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ color: "var(--outline)" }}
      >
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  if (!plate) return notFound();

  const fee = escrowFee(plate.price);
  const total = plate.price + fee + 120;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(
      () => router.push(`/plates/${plate.id ?? id}/checkout/complete`),
      2000,
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--surface)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 glass-nav flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full border-none cursor-pointer hover:bg-[var(--surface-container-low)] transition-colors"
          style={{ color: "var(--on-surface)", background: "transparent" }}
        >
          <ArrowLeft size={18} />
        </button>
        <span
          className="font-black text-base"
          style={{ color: "var(--primary)" }}
        >
          Secure Checkout
        </span>
        <div
          className="flex items-center gap-1.5"
          style={{ color: "var(--on-surface-variant)" }}
        >
          <Lock size={14} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            SSL Secured
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 pb-32 lg:pb-16 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
        {/* Left: Plate + Order Summary */}
        <div className="space-y-5">
          <div>
            <h1
              className="text-2xl lg:text-3xl font-black"
              style={{ color: "var(--on-surface)" }}
            >
              Finalize Your Acquisition
            </h1>
            <p
              className="text-sm font-medium mt-1"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Complete your secure transaction through Sakk Escrow.
            </p>
          </div>

          {/* Plate Preview Card */}
          <Card padding="lg" className="space-y-5">
            <div className="flex justify-center py-2">
              <PlateViz
                code={plate.code}
                num={plate.num}
                emirate={plate.emirate}
                type={plate.type}
                size="md"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p
                  className="text-base font-black"
                  style={{ color: "var(--on-surface)" }}
                >
                  {plate.emirate} {plate.code} {plate.num}
                </p>
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--outline)" }}
                >
                  {plate.num.length}-digit · {plate.emirate}
                </p>
              </div>
              <Badge variant="primary">
                {plate.isVerified ? "Verified" : "Listed"}
              </Badge>
            </div>
          </Card>

          {/* Order Summary */}
          <Card padding="md" className="space-y-3">
            <h3
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--outline)" }}
            >
              ORDER SUMMARY
            </h3>
            {[
              { label: "Plate Price", value: aed(plate.price) },
              { label: "Escrow Fee", value: aed(fee) },
              { label: "RTA Transfer", value: "AED 120" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center"
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {row.label}
                </span>
                <span
                  className="text-sm font-black"
                  style={{ color: "var(--on-surface)" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
            <div
              className="flex justify-between items-center pt-3 mt-2"
              style={{ borderTop: "2px solid var(--surface-container)" }}
            >
              <span
                className="text-base font-black"
                style={{ color: "var(--on-surface)" }}
              >
                Total
              </span>
              <span
                className="text-xl font-black"
                style={{ color: "var(--primary)" }}
              >
                {aed(total)}
              </span>
            </div>
          </Card>

          {/* Escrow Banner */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{
              background: "rgba(0,106,102,0.06)",
              border: "1px solid rgba(0,106,102,0.12)",
            }}
          >
            <ShieldCheck size={20} style={{ color: "var(--primary)" }} />
            <div>
              <p
                className="text-sm font-black"
                style={{ color: "var(--primary)" }}
              >
                100% Escrow Protected
              </p>
              <p
                className="text-[10px] font-medium"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Funds held securely until RTA transfer is confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Payment */}
        <div className="space-y-5">
          <h3
            className="text-lg font-black"
            style={{ color: "var(--on-surface)" }}
          >
            Payment Method
          </h3>

          <div className="space-y-3">
            {PAYMENT_METHODS.map(({ id, label, sub, Icon }) => (
              <button
                key={id}
                onClick={() => setPayMethod(id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all cursor-pointer border-2"
                style={{
                  background:
                    payMethod === id
                      ? "var(--teal-light)"
                      : "var(--surface-container-lowest)",
                  borderColor:
                    payMethod === id
                      ? "var(--primary)"
                      : "rgba(187,202,199,0.2)",
                  fontFamily: "inherit",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      payMethod === id
                        ? "var(--primary)"
                        : "var(--surface-container-low)",
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color:
                        payMethod === id
                          ? "white"
                          : "var(--on-surface-variant)",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-black"
                    style={{ color: "var(--on-surface)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: "var(--outline)" }}
                  >
                    {sub}
                  </p>
                </div>
                {payMethod === id && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "var(--primary)" }}
                  >
                    <Check size={12} color="white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <Button
            size="xl"
            className="w-full !py-4 !text-base !font-black !rounded-2xl mt-4"
            isLoading={isProcessing}
            onClick={handlePay}
            style={{ boxShadow: "0 6px 20px rgba(0,106,102,0.28)" }}
          >
            Pay {aed(total)} Securely
          </Button>

          <p
            className="text-center text-[10px] font-medium"
            style={{ color: "var(--outline)" }}
          >
            By proceeding you agree to Sakk's Terms of Service and Escrow
            Agreement.
          </p>
        </div>
      </div>
    </div>
  );
}
