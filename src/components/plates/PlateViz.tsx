import type { PlateSize, PlateType } from "@/types";

interface PlateVizProps {
  code: string;
  num: string;
  emirate: string;
  type: PlateType;
  size?: PlateSize;
}

const SIZES = {
  sm: { w: 120, h: 60, ns: 14, cs: 11, ls: 6 },
  md: { w: 168, h: 84, ns: 20, cs: 16, ls: 7 },
  lg: { w: 252, h: 126, ns: 30, cs: 22, ls: 10 },
};

export default function PlateViz({
  code,
  num,
  emirate,
  type,
  size = "md",
}: PlateVizProps) {
  const s = SIZES[size];

  if (type === "abudhabi") {
    return (
      <div
        style={{
          width: s.w,
          height: s.h,
          background: "#fff",
          borderRadius: 5,
          border: "1.5px solid #ddd",
          display: "flex",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "30%",
            background: "#B22234",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: s.cs,
              fontWeight: 700,
              fontFamily: "Georgia,serif",
            }}
          >
            {code}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <span
            style={{
              fontSize: s.ls,
              color: "#666",
              fontFamily: "var(--font-arabic)",
            }}
          >
            الإمارات أبوظبي
          </span>
          <span
            style={{
              fontSize: s.ns,
              fontWeight: 700,
              fontFamily: "Georgia,serif",
              letterSpacing: 1,
              color: "#111",
            }}
          >
            {num}
          </span>
          <span style={{ fontSize: s.ls, color: "#666" }}>U.A.E.A.D</span>
        </div>
      </div>
    );
  }

  if (type === "sharjah") {
    return (
      <div
        style={{
          width: s.w,
          height: s.h,
          background: "#fff",
          borderRadius: 5,
          border: "1.5px solid #ddd",
          display: "flex",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "18%",
            background: "#1A5C1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {["U", "A", "E"].map((l) => (
            <span
              key={l}
              style={{
                color: "#fff",
                fontSize: s.ls - 1,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {l}
            </span>
          ))}
          <span
            style={{
              color: "#fff",
              fontSize: s.cs * 0.8,
              fontWeight: 700,
              marginTop: 1,
            }}
          >
            {code}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: s.ls,
              color: "#666",
              fontFamily: "var(--font-arabic)",
            }}
          >
            الشارقة Sharjah
          </span>
          <span
            style={{
              fontSize: s.ns,
              fontWeight: 700,
              fontFamily: "Georgia,serif",
              letterSpacing: 1,
              color: "#111",
            }}
          >
            {num}
          </span>
        </div>
      </div>
    );
  }

  // Dubai gold / silver
  return (
    <div
      style={{
        width: s.w,
        height: s.h,
        background: type === "gold" ? "#C9A84C" : "#B0B0B0",
        borderRadius: 6,
        padding: 3,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          height: "100%",
          borderRadius: 4,
          padding: `2px ${size === "sm" ? 5 : size === "lg" ? 10 : 8}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: s.ls,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: "#222",
          }}
        >
          {emirate === "Dubai" ? "DUBAI  دبي" : emirate}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: s.cs,
              fontWeight: 700,
              fontFamily: "Georgia,serif",
              color: "#111",
            }}
          >
            {code}
          </span>
          <span
            style={{
              fontSize: s.ns,
              fontWeight: 700,
              fontFamily: "Georgia,serif",
              letterSpacing: 2,
              color: "#111",
            }}
          >
            {num}
          </span>
        </div>
      </div>
    </div>
  );
}
