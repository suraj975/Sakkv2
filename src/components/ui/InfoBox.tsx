import { ShieldCheck, Star, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "◈": ShieldCheck,
  "★": Star,
  "*": Star,
};

interface InfoBoxProps {
  sym: string;
  title: string;
  body: string;
  bg?: string;
  br?: string;
}

export default function InfoBox({ sym, title, body, bg, br }: InfoBoxProps) {
  const Icon = ICON_MAP[sym] || ShieldCheck;

  return (
    <div
      className="rounded-xl p-3.5 mb-3.5 flex gap-3 items-start"
      style={{
        background: bg || "var(--teal-light)",
        border: `1px solid ${br || "var(--teal-border)"}`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 34,
          height: 34,
          background: "var(--teal)",
          marginTop: 1,
        }}
      >
        <Icon size={16} strokeWidth={2} color="#fff" />
      </div>
      <div>
        <div
          className="text-[13px] font-semibold mb-1"
          style={{ color: "var(--teal-dark)" }}
        >
          {title}
        </div>
        <div
          className="text-[11px] leading-relaxed"
          style={{ color: "var(--teal-dark)", opacity: 0.85 }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

