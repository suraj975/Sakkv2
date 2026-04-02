"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  variant?: "light" | "dark";
}

export default function Logo({
  size = "md",
  showTagline = false,
  variant = "light",
}: LogoProps) {
  const iconSize = size === "sm" ? 32 : size === "md" ? 40 : 52;
  const textSize =
    size === "sm" ? "text-lg" : size === "md" ? "text-[22px]" : "text-3xl";
  const arabicSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  const textColor = variant === "dark" ? "#ffffff" : "var(--on-surface)";
  const taglineColor =
    variant === "dark" ? "rgba(255,255,255,0.5)" : "var(--outline)";
  const arabicColor =
    variant === "dark"
      ? "var(--primary-container)"
      : "var(--primary-container)";

  return (
    <div className="flex items-center gap-3">
      {/* Lock icon */}
      <div
        className="rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{
          width: iconSize,
          height: iconSize,
          background: "var(--primary)",
        }}
      >
        <svg
          width={iconSize * 0.55}
          height={iconSize * 0.55}
          viewBox="0 0 24 24"
          fill="none"
        >
          {/* Lock body */}
          <rect
            x="3"
            y="11"
            width="18"
            height="12"
            rx="3"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Lock shackle */}
          <path
            d="M8 11V7a4 4 0 0 1 8 0v4"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Diamond gem */}
          <path
            d="M12 15 l1.5 1.5 L12 19 L10.5 16.5 Z"
            fill="var(--primary)"
            opacity="0.9"
          />
          <path
            d="M10.5 16.5 L12 15 L13.5 16.5"
            stroke="var(--primary)"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col gap-0">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`${textSize} font-black tracking-tight leading-none`}
            style={{
              color: textColor,
              fontFamily: "var(--font-geist-sans, Arial, sans-serif)",
            }}
          >
            Madmoon
          </span>
          <span
            className={`${arabicSize} font-bold leading-none`}
            style={{
              color: arabicColor,
              fontFamily: "var(--font-arabic)",
            }}
          >
            مضمون
          </span>
        </div>
        {showTagline && (
          <span
            className="text-[8px] font-bold uppercase tracking-[0.18em] mt-0.5"
            style={{ color: taglineColor }}
          >
            Buy and sell with confidence
          </span>
        )}
      </div>
    </div>
  );
}
