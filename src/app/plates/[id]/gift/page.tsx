"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import PlateViz from "@/components/plates/PlateViz";
import Pill from "@/components/ui/Pill";
import IBox from "@/components/ui/IBox";
import TLine from "@/components/ui/TLine";
import InfoBox from "@/components/ui/InfoBox";
import PageHeader from "@/components/layout/PageHeader";
import { getPlateById, aed } from "@/lib/plates";

export default function GiftDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const plate = getPlateById(id);

  if (!plate) return notFound();

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader title="Gift a Plate" backHref="/" />

      <div
        className="flex flex-col items-center px-4 py-6 pb-7 gap-3"
        style={{ background: "var(--teal-dark)" }}
      >
        <PlateViz
          code={plate.code}
          num={plate.num}
          emirate={plate.emirate}
          type={plate.type}
          size="lg"
        />
      </div>

      <div className="p-4 lg:px-6 lg:max-w-[760px] lg:mx-auto">
        <div
          className="text-[22px] font-bold mb-1"
          style={{ color: "var(--sakk-text)" }}
        >
          {aed(plate.price)}
        </div>
        <Pill txt={`${plate.emirate} · ${plate.code} ${plate.num}`} />
        <TLine />

        <div
          className="rounded-xl px-3.5 py-3 mb-3.5 flex gap-3 items-center"
          style={{
            background: "var(--sakk-card)",
            border: "1px solid var(--sakk-border)",
          }}
        >
          <IBox sym="◉" sz={38} />
          <div>
            <div
              className="text-[13px] font-medium"
              style={{ color: "var(--sakk-text)" }}
            >
              {plate.seller}
            </div>
            <div className="text-[11px]" style={{ color: "var(--sakk-text3)" }}>
              {plate.emirate} · Verified · Listed {plate.days}d ago
            </div>
          </div>
        </div>

        <InfoBox
          sym="★"
          title="Gift this plate"
          body="Give this plate to someone special — wife, daughter, or a friend. They'll receive a personalised digital reveal and can accept at their convenience."
        />

        <button
          onClick={() => router.push(`/plates/${id}/gift/setup`)}
          className="w-full block lg:max-w-[480px] lg:mx-auto border-none rounded-xl py-3.5 text-sm font-semibold text-white cursor-pointer mb-2.5"
          style={{ background: "var(--teal)" }}
        >
          Gift this Plate
        </button>
        <button
          onClick={() => router.push(`/plates/${id}/checkout`)}
          className="w-full block lg:max-w-[480px] lg:mx-auto rounded-xl py-3 text-[13px] cursor-pointer mb-4"
          style={{
            background: "var(--sakk-card)",
            border: "1px solid var(--sakk-border)",
            color: "var(--sakk-text2)",
          }}
        >
          Buy for Myself Instead
        </button>
      </div>
    </div>
  );
}
