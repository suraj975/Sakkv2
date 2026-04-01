interface IBoxProps {
  sym: string;
  sz?: number;
  bg?: string;
}

export default function IBox({ sym, sz = 36, bg }: IBoxProps) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 text-white font-bold"
      style={{
        width: sz,
        height: sz,
        background: bg || "var(--teal)",
        borderRadius: Math.round(sz * 0.27),
        fontSize: Math.round(sz * 0.38),
      }}
    >
      {sym}
    </div>
  );
}
