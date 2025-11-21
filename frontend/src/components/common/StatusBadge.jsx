export default function StatusBadge({ status }) {
  const colorMap = {
    PENDING: "bg-yellow-600/40 text-yellow-300",
    IN_PROGRESS: "bg-blue-600/40 text-blue-300",
    RESOLVED: "bg-green-600/40 text-green-300",
    ESCALATED: "bg-red-600/40 text-red-300",
    CLOSED: "bg-gray-600/40 text-gray-300",
  };

  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
        colorMap[status] || "bg-slate-700 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}
