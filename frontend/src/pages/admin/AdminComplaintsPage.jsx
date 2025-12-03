import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import { apiRequest } from "../../services/apiClient";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Use /complaints (not /admin/complaints)
      const data = await apiRequest("/complaints", { auth: true });
      setComplaints(data?.complaints ?? []);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      // ✅ FIXED: Correct path for updating status
      await apiRequest(`/complaints/${id}/status`, {
        method: "PUT",
        auth: true,
        body: { status: newStatus },
      });
      fetchComplaints();
    } catch (err) {
      alert(err.message);
    }
  };

  const isOverdue = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = (now - created) / (1000 * 60 * 60);
    return diffHours > 24; // > 24 hours → SLA breach
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-slate-50">
            Complaints Management
          </h1>
          <p className="text-xs text-slate-400">
            Track and resolve student complaints. SLA violations are marked in
            red.
          </p>
        </header>

        <Card title="All Complaints" subtitle="Sorted by latest first">
          {loading ? (
            <p className="text-sm text-slate-400">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="text-sm text-slate-400">No complaints found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2 text-left">Student</th>
                    <th className="px-3 py-2 text-left">Hostel</th>
                    <th className="px-3 py-2 text-left">Room</th>
                    <th className="px-3 py-2 text-left">Issue</th>
                    <th className="px-3 py-2 text-left">Severity</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Created</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                  {complaints.map((c) => (
                    <tr
                      key={c.id}
                      className={isOverdue(c.createdAt) ? "bg-red-500/10" : ""}
                    >
                      <td className="px-3 py-2">{c.studentName}</td>
                      <td className="px-3 py-2">{c.hostelName}</td>
                      <td className="px-3 py-2">{c.roomNumber || "-"}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium">{c.issueType}</div>
                        <div className="text-xs text-slate-400">
                          {c.description}
                        </div>
                      </td>
                      <td className="px-3 py-2">{c.severity}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 space-x-2">
                        {["PENDING", "IN_PROGRESS"].includes(c.status) && (
                          <button
                            onClick={() => updateStatus(c.id, "RESOLVED")}
                            className="px-2 py-1 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Resolve
                          </button>
                        )}
                        {c.status !== "ESCALATED" && (
                          <button
                            onClick={() => updateStatus(c.id, "ESCALATED")}
                            className="px-2 py-1 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white"
                          >
                            Escalate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
