import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotificationBadge } from "../common/StatusBadge";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NotificationIcon, UserIcon, LogoutIcon, CloseIcon } from "../common/Icons";

export default function Topbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm">
              Welcome back, <span className="font-semibold text-white">{user?.name}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">{currentDate}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Time Display */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50">
          <span className="text-xs text-slate-400">Current Time:</span>
          <span className="text-sm font-mono text-slate-300">{currentTime}</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <NotificationIcon className="w-5 h-5 text-slate-300" />
            <NotificationBadge count={3} />
          </button>
          
          {showNotifications && createPortal(
            <div 
              className="notification-portal z-notification" 
              style={{ zIndex: 2147483647 }}
            >
              <div className="absolute right-6 top-16 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl animate-fade-in">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto scrollbar-thin">
                  <div className="space-y-2">
                    <NotificationItem 
                      title="New complaint assigned"
                      message="Room 101 - Water leakage issue"
                      time="2 min ago"
                      type="urgent"
                    />
                    <NotificationItem 
                      title="System maintenance"
                      message="Scheduled for tonight 2:00 AM"
                      time="3 hours ago"
                      type="info"
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-slate-800/50 text-slate-200 hover:bg-red-600/20 hover:text-red-300 border border-slate-700/50 hover:border-red-500/30 transition-all duration-200"
          >
            <LogoutIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function NotificationItem({ title, message, time, type = 'info' }) {
  const typeColors = {
    urgent: 'border-l-red-500 bg-red-500/5',
    success: 'border-l-green-500 bg-green-500/5',
    info: 'border-l-blue-500 bg-blue-500/5'
  };

  return (
    <div className={`p-3 rounded-lg border-l-2 ${typeColors[type]} hover:bg-slate-800/50 transition-colors cursor-pointer`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-slate-400 mt-1">{message}</p>
        </div>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
    </div>
  );
}