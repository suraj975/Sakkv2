"use client";

import { useState, useEffect } from "react";
import { X, Camera, ShieldCheck, Info, Check } from "lucide-react";
import PlateViz from "@/components/plates/PlateViz";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { createPlate } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import type { Emirate, PlateTypeFS } from "@/types/firebase";

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostListingModal({
  isOpen,
  onClose,
}: PostListingModalProps) {
  const [step, setStep] = useState(1);
  const [emirate, setEmirate] = useState("Dubai");
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const getPlateType = (em: string): PlateTypeFS => {
    if (em === "Abu Dhabi") return "abudhabi";
    if (em === "Sharjah") return "sharjah";
    return "gold";
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("You must be signed in to post a listing.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createPlate({
        code: code.toUpperCase(),
        num: number,
        emirate: emirate as Emirate,
        type: getPlateType(emirate),
        listingType: "fixed",
        status: "active",
        price: Number(price),
        sellerId: user.uid,
        sellerName: profile?.displayName ?? user.displayName ?? "Anonymous",
        sellerIsVerified: profile?.isVerified ?? false,
        isVerified: false,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setSubmitError((err as Error).message ?? "Failed to post listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setEmirate("Dubai");
    setCode("");
    setNumber("");
    setPrice("");
    setIsSubmitting(false);
    setIsSuccess(false);
    setSubmitError(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ transition: "opacity 0.2s", opacity: isOpen ? 1 : 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(25,28,29,0.55)",
          backdropFilter: "blur(8px)",
        }}
        onClick={resetAndClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl rounded-[28px] overflow-hidden"
        style={{
          background: "var(--surface-container-lowest)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          transform: isOpen
            ? "scale(1) translateY(0)"
            : "scale(0.96) translateY(16px)",
          transition: "transform 0.25s ease, opacity 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--surface-container)" }}
        >
          <div>
            <h2
              className="text-xl font-black"
              style={{ color: "var(--on-surface)" }}
            >
              Post Your Plate
            </h2>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
              style={{ color: "var(--outline)" }}
            >
              Step {step} of 3
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface-container-low)]"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-10 space-y-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{
                  background: "var(--green-bg)",
                  border: "1px solid rgba(22,163,74,0.2)",
                }}
              >
                <Check
                  size={36}
                  strokeWidth={2.5}
                  style={{ color: "var(--green)" }}
                />
              </div>
              <div className="space-y-2">
                <h3
                  className="text-2xl font-black"
                  style={{ color: "var(--on-surface)" }}
                >
                  Listing Published!
                </h3>
                <p
                  className="font-medium max-w-xs mx-auto"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Your plate is now live on the marketplace. We'll notify you of
                  any offers.
                </p>
              </div>
              <Button className="w-full" onClick={resetAndClose}>
                View My Listings
              </Button>
            </div>
          ) : (
            <div className="space-y-7">
              {step === 1 && (
                <div className="space-y-5">
                  <div
                    className="rounded-2xl flex items-center justify-center border min-h-[150px]"
                    style={{
                      background: "var(--surface-container-low)",
                      borderColor: "var(--surface-container)",
                    }}
                  >
                    {code && number ? (
                      <PlateViz
                        emirate={emirate}
                        code={code}
                        num={number}
                        type={getPlateType(emirate)}
                        size="md"
                      />
                    ) : (
                      <div
                        className="text-center space-y-2"
                        style={{ color: "var(--outline)" }}
                      >
                        <Camera size={36} className="mx-auto opacity-30" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          Plate Preview
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        className="text-[10px] font-black uppercase tracking-widest ml-1"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        Emirate
                      </label>
                      <select
                        value={emirate}
                        onChange={(e) => setEmirate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-bold focus:outline-none transition-all"
                        style={{
                          background: "var(--surface-container-low)",
                          border: "1.5px solid transparent",
                          color: "var(--on-surface)",
                          fontFamily: "inherit",
                        }}
                      >
                        <option>Dubai</option>
                        <option>Abu Dhabi</option>
                        <option>Sharjah</option>
                      </select>
                    </div>
                    <Input
                      label="Plate Code"
                      placeholder="e.g. A"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <Input
                    label="Plate Number"
                    placeholder="e.g. 786"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                  <Button
                    className="w-full py-3.5"
                    onClick={() => setStep(2)}
                    disabled={!code || !number}
                  >
                    Continue to Pricing
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div
                    className="rounded-2xl p-5 space-y-3"
                    style={{
                      background: "rgba(0,106,102,0.05)",
                      border: "1px solid rgba(0,106,102,0.12)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2.5"
                      style={{ color: "var(--primary)" }}
                    >
                      <ShieldCheck size={18} />
                      <span className="text-sm font-bold">
                        Recommended Price Range
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-xl font-black"
                        style={{ color: "var(--on-surface)" }}
                      >
                        AED 840,000 — 920,000
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--outline)" }}
                      >
                        Based on market data
                      </span>
                    </div>
                  </div>
                  <Input
                    label="Your Asking Price (AED)"
                    placeholder="e.g. 850,000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                  />
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: "var(--amber-bg)",
                      border: "1px solid rgba(217,119,6,0.2)",
                    }}
                  >
                    <Info size={17} style={{ color: "var(--amber)" }} />
                    <p
                      className="text-[10px] font-bold uppercase tracking-tight"
                      style={{ color: "var(--amber)" }}
                    >
                      A 2.5% service fee applies upon successful sale.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-[2]"
                      onClick={() => setStep(3)}
                      disabled={!price}
                    >
                      Review Listing
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <Card variant="flat" padding="md" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary">Preview</Badge>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--outline)" }}
                      >
                        {emirate} · Code {code}
                      </span>
                    </div>
                    <div className="flex items-center justify-center py-3">
                      <PlateViz
                        emirate={emirate}
                        code={code}
                        num={number}
                        type={getPlateType(emirate)}
                        size="sm"
                      />
                    </div>
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{
                        borderTop: "1px solid var(--surface-container)",
                      }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        Asking Price
                      </span>
                      <span
                        className="text-xl font-black"
                        style={{ color: "var(--on-surface)" }}
                      >
                        AED {Number(price).toLocaleString()}
                      </span>
                    </div>
                  </Card>

                  <div className="space-y-3">
                    {[
                      "I confirm that I am the legal owner of this plate and have the authority to sell it.",
                      "I agree to the marketplace terms and conditions and the 2.5% service fee.",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--primary)" }}
                        >
                          <Check size={10} color="white" strokeWidth={3} />
                        </div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--on-surface-variant)" }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-[2]"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                    >
                      Publish Listing
                    </Button>
                  </div>
                  {submitError && (
                    <p
                      className="text-xs text-center mt-2"
                      style={{ color: "#BA1A1A" }}
                    >
                      {submitError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
