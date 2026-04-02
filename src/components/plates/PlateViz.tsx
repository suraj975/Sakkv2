import type { PlateSize, PlateType } from "@/types";

interface PlateVizProps {
  code: string;
  num: string;
  emirate: string;
  type: PlateType;
  size?: PlateSize;
}

const SIZES = {
  sm: { w: 120, h: 54, ns: 13, cs: 10, ls: 6 },
  md: { w: 188, h: 84, ns: 20, cs: 16, ls: 7 },
  lg: { w: 282, h: 126, ns: 30, cs: 22, ls: 10 },
};

const STANDARD_EMIRATE_STYLES: Record<
  string,
  {
    cellBg: string;
    cellText: string;
    codeColor: string;
    codeText: string;
    sourceTop: string;
    sourceMiddle: string;
    sourceBottom: string;
    sourceBottomArabic?: string;
  }
> = {
  Dubai: {
    cellBg: "#C9A84C",
    cellText: "#FFFFFF",
    codeColor: "#111111",
    codeText: "code",
    sourceTop: "دبي",
    sourceMiddle: "DUBAI",
    sourceBottom: "",
  },
  Ajman: {
    cellBg: "#42526E",
    cellText: "#FFFFFF",
    codeColor: "#D9DEEA",
    codeText: "code",
    sourceTop: "الإمارات",
    sourceMiddle: "UAE.AJMAN",
    sourceBottom: "AJMAN",
    sourceBottomArabic: "عجمان",
  },
  RAK: {
    cellBg: "#3B6E78",
    cellText: "#FFFFFF",
    codeColor: "#D9DEEA",
    codeText: "code",
    sourceTop: "الإمارات",
    sourceMiddle: "UAE.RAK",
    sourceBottom: "RAK",
    sourceBottomArabic: "رأس الخيمة",
  },
  Fujairah: {
    cellBg: "#6F8183",
    cellText: "#FFFFFF",
    codeColor: "#D9DEEA",
    codeText: "code",
    sourceTop: "الإمارات",
    sourceMiddle: "UAE.FUJ",
    sourceBottom: "FUJAIRAH",
    sourceBottomArabic: "الفجيرة",
  },
  UAQ: {
    cellBg: "#7E8A8C",
    cellText: "#FFFFFF",
    codeColor: "#D9DEEA",
    codeText: "code",
    sourceTop: "الإمارات",
    sourceMiddle: "UAE.UAQ",
    sourceBottom: "UAQ",
    sourceBottomArabic: "أم القيوين",
  },
};

function renderSourceBlock(
  s: (typeof SIZES)[PlateSize],
  size: PlateSize,
  {
    top,
    middle,
    bottom,
    bottomArabic,
    align = "center",
  }: {
    top: string;
    middle: string;
    bottom: string;
    bottomArabic?: string;
    align?: "center" | "start";
  }
) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align === "center" ? "center" : "left",
        lineHeight: 1,
        gap: size === "sm" ? 1 : 2,
      }}
    >
      <span
        dir="rtl"
        style={{
          fontFamily: "var(--font-arabic)",
          fontSize: size === "sm" ? s.ls + 1 : s.ls + 4,
          fontWeight: 700,
          color: "#111",
        }}
      >
        {top}
      </span>
      <span
        style={{
          fontSize: size === "sm" ? s.ls : s.ls + 2,
          fontWeight: 700,
          color: "#111",
          letterSpacing: 0.2,
        }}
      >
        {middle}
      </span>
      <span
        style={{
          fontSize: size === "sm" ? s.ls + 0.5 : s.ls + 2,
          fontWeight: 800,
          color: "#111",
          letterSpacing: 0.3,
        }}
      >
        {bottom}
      </span>
      {bottomArabic ? (
        <span
          dir="rtl"
          style={{
            fontFamily: "var(--font-arabic)",
            fontSize: size === "sm" ? s.ls + 1 : s.ls + 3,
            fontWeight: 700,
            color: "#111",
          }}
        >
          {bottomArabic}
        </span>
      ) : null}
    </div>
  );
}

export default function PlateViz({
  code,
  num,
  emirate,
  type,
  size = "md",
}: PlateVizProps) {
  const s = SIZES[size];
  const plateStyle = STANDARD_EMIRATE_STYLES[emirate] ?? STANDARD_EMIRATE_STYLES.Dubai;
  const borderWidth = size === "sm" ? 2 : 3;
  const radius = size === "lg" ? 8 : 6;
  const codeCellWidth = size === "lg" ? 56 : size === "md" ? 40 : 26;
  const sourceCellWidth = size === "lg" ? 114 : size === "md" ? 80 : 52;
  const numberFontSize =
    size === "sm" ? s.ns + 2 : size === "md" ? s.ns + 4 : s.ns + 6;

  if (type === "abudhabi") {
    return (
      <div
        style={{
          width: s.w,
          height: s.h,
          background: "#fff",
          borderRadius: radius,
          border: `${borderWidth}px solid #111`,
          display: "flex",
          overflow: "hidden",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: codeCellWidth,
            background: "#B22234",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: size === "sm" ? s.cs + 4 : s.cs + 8,
              fontWeight: 800,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1,
            }}
          >
            {code}
          </span>
        </div>
        <div
          style={{
            width: sourceCellWidth,
            display: "flex",
            justifyContent: "center",
            padding: size === "sm" ? "2px 4px" : "4px 6px",
            boxSizing: "border-box",
            borderRight: "1px solid #111",
          }}
        >
          {renderSourceBlock(s, size, {
            top: "الإمارات",
            middle: "U.A.E.A.D",
            bottom: "ABU DHABI",
            bottomArabic: "أبوظبي",
            align: "start",
          })}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: size === "sm" ? "0 6px" : "0 10px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: numberFontSize,
              fontWeight: 800,
              fontFamily: "Arial, sans-serif",
              letterSpacing: size === "sm" ? 1 : 3,
              color: "#111",
              lineHeight: 1,
            }}
          >
            {num}
          </span>
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
          borderRadius: radius,
          border: `${borderWidth}px solid #111`,
          display: "flex",
          overflow: "hidden",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: codeCellWidth,
            background: "#1A5C1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #111",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: size === "sm" ? s.cs + 4 : s.cs + 8,
              fontWeight: 800,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1,
            }}
          >
            {code}
          </span>
        </div>
        <div
          style={{
            width: sourceCellWidth,
            display: "flex",
            justifyContent: "center",
            padding: size === "sm" ? "2px 4px" : "4px 6px",
            boxSizing: "border-box",
            borderRight: "1px solid #111",
          }}
        >
          {renderSourceBlock(s, size, {
            top: "الشارقة",
            middle: "U.A.E.",
            bottom: "SHARJAH",
            bottomArabic: "الشارقة",
            align: "center",
          })}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: size === "sm" ? "0 6px" : "0 10px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: numberFontSize,
              fontWeight: 800,
              fontFamily: "Arial, sans-serif",
              letterSpacing: size === "sm" ? 1 : 3,
              color: "#111",
              lineHeight: 1,
            }}
          >
            {num}
          </span>
        </div>
      </div>
    );
  }

  // Standard Dubai/Ajman/RAK/Fujairah/UAQ-style plate
  return (
    <div
      style={{
        width: s.w,
        height: s.h,
        background: "#fff",
        borderRadius: radius,
        border: `${borderWidth}px solid #111`,
        flexShrink: 0,
        boxSizing: "border-box",
        display: "flex",
        overflow: "hidden",
      }}
    >
        <div
          style={{
            width: codeCellWidth,
            background: plateStyle.cellBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          borderRight: "1px solid #111",
        }}
      >
        <span
          style={{
            color: plateStyle.cellText,
            fontSize: size === "sm" ? s.cs + 4 : s.cs + 8,
            fontWeight: 800,
            fontFamily: emirate === "Dubai" ? "Arial, sans-serif" : "Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          {code}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          width: sourceCellWidth,
          justifyContent: "center",
          padding: size === "sm" ? "2px 4px" : "4px 6px",
          boxSizing: "border-box",
          borderRight: "1px solid #111",
        }}
      >
        {renderSourceBlock(s, size, {
          top: plateStyle.sourceTop,
          middle: plateStyle.sourceMiddle,
          bottom: plateStyle.sourceBottom,
          bottomArabic: plateStyle.sourceBottomArabic,
          align: emirate === "Dubai" ? "center" : "start",
        })}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: size === "sm" ? "0 6px" : "0 10px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontSize: numberFontSize,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            letterSpacing: size === "sm" ? 1 : 3,
            color: "#111",
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <div
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
