"use client";

import { Suspense } from "react";
import {
  useParams,
  notFound,
  useRouter,
  useSearchParams,
} from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import IBox from "@/components/ui/IBox";
import InfoBox from "@/components/ui/InfoBox";
import PageHeader from "@/components/layout/PageHeader";
import { getPlateById, aed, escrowFee, priceTier } from "@/lib/plates";

function GiftCheckoutInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const plate = getPlateById(id);

  if (!plate) return notFound();

  const recipientName = searchParams.get("name") || "";
  const message = searchParams.get("msg") || "";

  const fee = escrowFee(plate.price);
  const total = plate.price + fee;

  const handlePay = () => {
    const params = new URLSearchParams({
      plateId: String(plate.id),
      from: "Mohammed Al Hamdan",
      name: recipientName,
      msg: message,
    });
    router.push(`/gift/reveal?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader title="Gift Checkout" backHref={`/plates/${id}/gift/setup`} />

      <div className="p-4 lg:px-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
        <div>
          {/* Recipient */}
          <div
            className="rounded-xl p-3.5 mb-3.5 flex gap-2.5 items-center"
            style={{
              background: "var(--teal-light)",
              border: "1px solid var(--teal-border)",
            }}
          >
            <IBox sym="★" sz={36} />
            <div>
              <div
                className="text-[11px] font-medium mb-0.5"
                style={{ color: "var(--teal)" }}
              >
                Gifting to
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--teal-dark)" }}
              >
                {recipientName}
              </div>
              {message && (
                <div
                  className="text-[11px] italic mt-0.5"
                  style={{ color: "var(--teal-dark)", opacity: 0.8 }}
                >
                  &ldquo;{message}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Plate summary */}
          <div
            className="rounded-xl p-3 mb-3.5 flex gap-3 items-center"
            style={{
              background: "var(--sakk-card)",
              border: "1px solid var(--sakk-border)",
            }}
          >
            <PlateViz
              code={plate.code}
              num={plate.num}
              emirate={plate.emirate}
              type={plate.type}
              size="sm"
            />
            <div>
              <div
                className="text-[13px] font-semibold"
                style={{ color: "var(--sakk-text)" }}
              >
                {plate.emirate} · {plate.code} {plate.num}
              </div>
              <div
                className="text-[11px] mt-0.5"
                style={{ color: "var(--sakk-text3)" }}
              >
                Sold by {plate.seller}
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div
            className="rounded-xl p-3.5 mb-3.5"
            style={{
              background: "var(--sakk-card)",
              border: "1px solid var(--sakk-border)",
            }}
          >
            <div
              className="text-[13px] font-semibold mb-3 pb-2.5"
              style={{
                color: "var(--sakk-text)",
                borderBottom: "1px solid var(--sakk-border)",
              }}
            >
              Payment Breakdown
            </div>
            <div className="flex justify-between mb-2.5">
              <span
                className="text-[13px]"
                style={{ color: "var(--sakk-text2)" }}
              >
                Plate Price
              </span>
              <span
                className="text-[13px]"
                style={{ color: "var(--sakk-text)" }}
              >
                {aed(plate.price)}
              </span>
            </div>
            <div className="flex justify-between mb-2.5">
              <span
                className="text-[13px]"
                style={{ color: "var(--sakk-text3)" }}
              >
                Escrow Fee — {priceTier(plate.price)}
              </span>
              <span
                className="text-[13px]"
                style={{ color: "var(--sakk-text3)" }}
              >
                {aed(fee)}
              </span>
            </div>
            <div
              className="flex justify-between items-center pt-2.5"
              style={{ borderTop: "1px solid var(--sakk-border)" }}
            >
              <span
                className="text-[15px] font-semibold"
                style={{ color: "var(--sakk-text)" }}
              >
                Total
              </span>
              <span
                className="text-[17px] font-bold"
                style={{ color: "var(--teal)" }}
              >
                {aed(total)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <InfoBox
            sym="◈"
            title="Protected by Sakk Escrow"
            body="Funds held in Sakk escrow until recipient accepts and transfer is confirmed."
          />

          <button
            onClick={handlePay}
            className="w-full border-none rounded-xl py-3.5 text-sm font-semibold text-white cursor-pointer mb-2.5"
            style={{ background: "var(--teal)" }}
          >
            Pay &amp; Send Gift
          </button>
          <div
            className="text-[11px] text-center mb-4"
            style={{ color: "var(--sakk-text3)" }}
          >
            Funds held in Sakk escrow until recipient accepts and transfer is
            confirmed
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftCheckoutPage() {
  return (
    <Suspense>
      <GiftCheckoutInner />
    </Suspense>
  );
}
