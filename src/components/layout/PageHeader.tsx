"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, backHref, actions }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-40 glass-nav flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16"
      style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => backHref ? router.push(backHref) : router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-xl border-none cursor-pointer transition-colors hover:bg-[var(--surface-container-low)]"
          style={{ background: "var(--teal-light)", color: "var(--primary)" }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="text-base font-black" style={{ color: "var(--on-surface)" }}>{title}</span>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
