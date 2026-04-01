import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--sakk-bg)" }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile: phone-frame wrapper */}
        <div className="flex-1 flex flex-col w-full lg:max-w-none max-w-[430px] mx-auto lg:mx-0">
          {/* Mobile status bar sim */}
          <div
            className="flex justify-between items-center px-4 pt-2 text-xs flex-shrink-0 lg:hidden"
            style={{
              background: "var(--sakk-card)",
              color: "var(--sakk-text)",
            }}
          >
            <span className="font-semibold">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm text-white"
              style={{ background: "#16A34A" }}
            >
              35
            </span>
          </div>

          {/* Page content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {children}
          </main>

          {/* Mobile bottom nav */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
