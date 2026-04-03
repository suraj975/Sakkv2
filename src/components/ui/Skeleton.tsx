"use client";

import { cn } from "@/lib/utils";

/** Single animated skeleton bar */
export function SkeletonBlock({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-lg", className)}
      style={{ background: "var(--surface-container-high)", ...style }}
    />
  );
}

/** Plate card skeleton — matches PlateCard dimensions */
export function PlateCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "var(--surface-container-lowest)",
        border: "1px solid rgba(187,202,199,0.2)",
      }}
    >
      {/* Plate area */}
      <div
        className="flex items-center justify-center px-4 py-5"
        style={{ background: "var(--surface-container-high)", height: 100 }}
      >
        <SkeletonBlock className="w-40 h-14 rounded-xl" />
      </div>
      {/* Footer */}
      <div
        className="px-4 py-3 space-y-2"
        style={{ background: "var(--surface-container-low)" }}
      >
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Plate detail page skeleton */
export function PlateDetailSkeleton() {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--surface)" }}
    >
      {/* Hero */}
      <div
        className="flex items-center justify-center p-6 pb-12"
        style={{ background: "var(--surface-container-high)", minHeight: 220 }}
      >
        <SkeletonBlock className="w-56 h-20 rounded-xl" />
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:px-8 lg:pt-8">
        <div className="px-5 py-5 lg:px-0 space-y-6">
          <SkeletonBlock className="h-10 w-40" />
          <SkeletonBlock className="h-4 w-48" />
          <div className="space-y-3 pt-4">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <SkeletonBlock className="h-16 rounded-2xl" />
            <SkeletonBlock className="h-16 rounded-2xl" />
            <SkeletonBlock className="h-16 rounded-2xl" />
            <SkeletonBlock className="h-16 rounded-2xl" />
          </div>
        </div>
        <div className="hidden lg:block space-y-4 pt-0">
          <SkeletonBlock className="h-40 rounded-2xl" />
          <SkeletonBlock className="h-12 rounded-2xl" />
          <SkeletonBlock className="h-12 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** Grid of plate card skeletons */
export function PlateGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PlateCardSkeleton key={i} />
      ))}
    </div>
  );
}
