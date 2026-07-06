import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/allocations": "Allocations",
  "/admin/rooms": "Rooms",
  "/admin/complaints": "Complaints",
  "/student": "Dashboard",
  "/student/complaints": "My Complaints",
};

export default function Topbar({ onToggleSidebar }) {
  const { logout } = useAuth();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "";
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-400 hover:text-white text-lg"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {pageTitle && (
          <h2 className="text-sm font-semibold text-white hidden sm:block">
            {pageTitle}
          </h2>
        )}

        <div className="text-sm text-slate-400">
          <span className="hidden sm:inline">Current Time: </span>
          <span className="text-white">{time}</span>
        </div>
      </div>

      {/* Right side */}
      <div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
