"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--sakk-bg)" }}>
        <main className="flex-1 flex flex-col">{children}</main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--sakk-bg)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 flex flex-col overflow-hidden">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
