import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onToggleSidebar }) {
  const { logout } = useAuth();
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
          className="text-slate-400 hover:text-white text-lg"
        >
          ☰
        </button>

        <div className="text-sm text-slate-400">
          Current Time: <span className="text-white">{time}</span>
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
