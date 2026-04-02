"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "@/context/AuthContext";
import AuthGateModal from "@/components/auth/AuthGateModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isLanding = pathname === "/";
  const showBottomNav = !loading && !!user;

  // Show gate on all non-landing routes for unauthenticated users
  const showGate = !isLanding && !loading && !user;

  if (isLanding) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--sakk-bg)" }}
      >
        <main className="flex-1 flex flex-col">{children}</main>
        {showBottomNav && <div className="h-24 lg:hidden" aria-hidden="true" />}
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--sakk-bg)" }}>
      {showGate && <AuthGateModal destinationHref={pathname} />}
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col min-h-screen">
        <div className="flex min-w-0 flex-1 flex-col w-full">
          <main
            className="flex min-w-0 flex-1 flex-col overflow-hidden transition-[filter] duration-300"
            style={
              showGate
                ? {
                    filter: "blur(6px)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }
                : undefined
            }
          >
            {children}
          </main>
          {showBottomNav && <div className="h-24 lg:hidden" aria-hidden="true" />}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
