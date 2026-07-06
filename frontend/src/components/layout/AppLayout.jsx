import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function AppLayout({ children }) {
  // On desktop the sidebar is always visible; on mobile it's an off-canvas
  // drawer toggled by the hamburger in the Topbar.
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onToggleSidebar={() => setMobileOpen((v) => !v)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">{children}</div>

          {/* Background Pattern */}
          <div className="fixed inset-0 pointer-events-none opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
              }}
            />
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay />
    </div>
  );
}

function LoadingOverlay() {
  // This can be controlled by a global loading state
  const isLoading = false;

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-300 text-sm">Loading...</p>
      </div>
    </div>
  );
}
