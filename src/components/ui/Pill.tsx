interface PillProps {
  txt: string;
  hi?: boolean;
}

export default function Pill({ txt, hi }: PillProps) {
  return (
    <span
      className="inline-block rounded-full px-[11px] py-1 text-[11px]"
      style={{
        background: hi ? "var(--teal-light)" : "#F0F2F3",
        color: hi ? "var(--teal-dark)" : "var(--sakk-text2)",
      }}
    >
      {txt}
    </span>
  );
}
