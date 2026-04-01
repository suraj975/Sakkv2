"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export default function PageHeader({ title, backHref }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
      style={{
        background: "var(--sakk-card)",
        borderBottom: "1px solid var(--sakk-border)",
      }}
    >
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-none transition-colors"
        style={{ background: "var(--teal-light)", color: "var(--teal-dark)" }}
        aria-label="Go back"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
      </button>
      <span
        className="text-[15px] font-semibold"
        style={{ color: "var(--sakk-text)" }}
      >
        {title}
      </span>
    </div>
  );
}

