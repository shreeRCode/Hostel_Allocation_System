import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import Table from "../../components/common/Table";
import { apiRequest } from "../../services/apiClient";
import { ComplaintsIcon } from "../../components/common/Icons";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ FIXED: Use /complaints (not /admin/complaints)
      const data = await apiRequest("/complaints", { auth: true });
      setComplaints(data?.complaints ?? []);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError(err.message || "Failed to load complaints.");
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

  const columns = [
    { key: "studentName", label: "Student" },
    { key: "hostelName", label: "Hostel" },
    {
      key: "roomNumber",
      label: "Room",
      render: (value) => value || "-",
    },
    {
      key: "issueType",
      label: "Issue",
      render: (value, item) => (
        <div>
          <div className="font-medium text-white">{value}</div>
          <div className="text-xs text-slate-400 line-clamp-1">{item.description}</div>
        </div>
      ),
    },
    { key: "severity", label: "Severity" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    { key: "createdAt", label: "Created", type: "datetime" },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, c) => (
        <div className="flex gap-2">
          {c.status === "PENDING" && (
            <button
              onClick={() => updateStatus(c.id, "IN_PROGRESS")}
              className="px-2 py-1 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start
            </button>
          )}
          {/* Resolve is available for PENDING/IN_PROGRESS/ESCALATED — previously
              an escalated complaint had no path back to resolved (dead end). */}
          {["PENDING", "IN_PROGRESS", "ESCALATED"].includes(c.status) && (
            <button
              onClick={() => updateStatus(c.id, "RESOLVED")}
              className="px-2 py-1 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Resolve
            </button>
          )}
          {["PENDING", "IN_PROGRESS"].includes(c.status) && (
            <button
              onClick={() => updateStatus(c.id, "ESCALATED")}
              className="px-2 py-1 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              Escalate
            </button>
          )}
        </div>
      ),
    },
  ];

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

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Card
          title="All Complaints"
          subtitle="Sorted by latest first"
          icon={<ComplaintsIcon className="w-5 h-5" />}
        >
          <Table
            data={complaints}
            columns={columns}
            loading={loading}
            emptyMessage="No complaints found."
            rowClassName={(c) => (isOverdue(c.createdAt) ? "bg-red-500/10" : "")}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
