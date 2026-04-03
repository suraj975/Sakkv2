"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlateDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center"
      style={{ background: "var(--surface)" }}
    >
      <span className="text-5xl">🔍</span>
      <div>
        <h2
          className="text-xl font-black"
          style={{ color: "var(--on-surface)" }}
        >
          Couldn&apos;t load this plate
        </h2>
        <p
          className="mt-2 text-sm max-w-xs mx-auto"
          style={{ color: "var(--on-surface-variant)" }}
        >
          There was a problem fetching this listing. It may have been removed or
          there was a network issue.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-2xl text-sm font-bold cursor-pointer border-none"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/search")}
          className="px-5 py-2.5 rounded-2xl text-sm font-bold cursor-pointer border-none"
          style={{
            background: "var(--surface-container-high)",
            color: "var(--on-surface)",
          }}
        >
          Browse Plates
        </button>
      </div>
    </div>
  );
}
