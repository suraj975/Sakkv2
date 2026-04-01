"use client";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--teal)" }}
      >
        <span
          className="text-white text-[17px] font-bold"
          style={{ fontFamily: "var(--font-arabic)" }}
        >
          صك
        </span>
      </div>
      <div className="flex items-baseline gap-[5px]">
        <span
          className="text-[17px] font-bold tracking-[0.5px]"
          style={{ color: "var(--sakk-text)" }}
        >
          sakk
        </span>
        <span
          className="text-[11px]"
          style={{ color: "var(--teal)", fontFamily: "var(--font-arabic)" }}
        >
          صك
        </span>
      </div>
    </div>
  );
}
