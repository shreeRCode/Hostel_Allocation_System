export default function StatusBadge({ status, size = 'sm', animated = false }) {
  const colorMap = {
    PENDING: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    IN_PROGRESS: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    RESOLVED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    ESCALATED: "bg-red-500/20 text-red-300 border-red-500/30",
    CLOSED: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    ACTIVE: "bg-green-500/20 text-green-300 border-green-500/30",
    INACTIVE: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    ALLOCATED: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    AVAILABLE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    OCCUPIED: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    MAINTENANCE: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
  };

  const sizeMap = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconMap = {
    PENDING: "⏳",
    IN_PROGRESS: "🔄",
    RESOLVED: "✅",
    ESCALATED: "🚨",
    CLOSED: "🔒",
    ACTIVE: "🟢",
    INACTIVE: "⚫",
    ALLOCATED: "🏠",
    AVAILABLE: "✨",
    OCCUPIED: "👥",
    MAINTENANCE: "🔧"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-200 ${
        colorMap[status] || "bg-slate-700/50 text-slate-300 border-slate-600/50"
      } ${sizeMap[size]} ${
        animated ? 'animate-pulse' : 'hover:scale-105'
      }`}
    >
      <span className="text-xs">{iconMap[status]}</span>
      {status}
    </span>
  );
}

// Priority Badge Component
export function PriorityBadge({ priority, size = 'sm' }) {
  const priorityMap = {
    LOW: "bg-green-500/20 text-green-300 border-green-500/30",
    MEDIUM: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    HIGH: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    CRITICAL: "bg-red-500/20 text-red-300 border-red-500/30"
  };

  const sizeMap = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${
        priorityMap[priority] || "bg-slate-700/50 text-slate-300 border-slate-600/50"
      } ${sizeMap[size]}`}
    >
      {priority}
    </span>
  );
}

// Notification Badge Component
export function NotificationBadge({ count, max = 99 }) {
  if (!count || count === 0) return null;
  
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
      {displayCount}
    </span>
  );
}