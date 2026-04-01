interface HeroProps {
  tag: string;
  h1: string;
  ac: string;
  sub?: string;
}

export default function Hero({ tag, h1, ac, sub }: HeroProps) {
  return (
    <div
      className="px-5 pt-6 pb-7 lg:px-10 lg:pt-10 lg:pb-12"
      style={{ background: "var(--teal-dark)" }}
    >
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 mb-3.5"
        style={{
          background: "rgba(12,191,184,0.15)",
          border: "1px solid rgba(12,191,184,0.35)",
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "var(--teal)" }}
        />
        <span
          className="text-[10px] font-medium tracking-[1.5px]"
          style={{ color: "var(--teal)" }}
        >
          {tag}
        </span>
      </div>
      <div className="text-[22px] lg:text-[30px] font-bold text-white leading-snug">
        {h1}
        <br />
        <span style={{ color: "var(--teal)" }}>{ac}</span>
      </div>
      {sub && (
        <div
          className="text-xs lg:text-sm leading-relaxed mt-1"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
