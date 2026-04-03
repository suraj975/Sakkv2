"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "@/context/AuthContext";
import ChatWidget from "@/components/chatbot/ChatWidget";
import { useChatbotFlag } from "@/lib/chatbot/useChatbotFlag";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useAuth();
  const { enabled: chatbotEnabled } = useChatbotFlag();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--sakk-bg)" }}
      >
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--sakk-bg)" }}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col min-h-screen">
        <div className="flex min-w-0 flex-1 flex-col w-full">
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden transition-[filter] duration-300">
            {children}
          </main>
          <div className="h-24 lg:hidden" aria-hidden="true" />
          <BottomNav />
        </div>
      </div>
      {chatbotEnabled && <ChatWidget />}
    </div>
  );
}
