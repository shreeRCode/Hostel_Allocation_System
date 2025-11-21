import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import { apiRequest } from "../../services/apiClient";

export default function StudentComplaintsPage() {
  const [form, setForm] = useState({
    issueType: "",
    description: "",
    severity: "MEDIUM",
  });
  const [submitting, setSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/complaints/my", { auth: true });
      setComplaints(data?.complaints ?? []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("/complaints", {
        method: "POST",
        body: form,
        auth: true,
      });
      setForm({ issueType: "", description: "", severity: "MEDIUM" });
      await fetchComplaints();
    } catch (err) {
      alert(err.message || "Could not submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-slate-50">My Complaints</h1>
          <p className="text-xs text-slate-400">
            Raise new hostel/room issues and track their SLA status.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Raise new complaint"
            subtitle="Describe the issue clearly for faster resolution"
            className="md:col-span-1"
          >
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  Issue type
                </label>
                <input
                  name="issueType"
                  value={form.issueType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Water leakage, WiFi issue, cleanliness…"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  Severity
                </label>
                <select
                  name="severity"
                  value={form.severity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Add any extra details like timings, exact location, etc."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit complaint"}
              </button>
            </form>
          </Card>

          <Card
            title="All complaints"
            subtitle="Latest complaints you have raised"
            className="md:col-span-2"
          >
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : complaints.length === 0 ? (
              <p className="text-sm text-slate-400">
                You haven’t raised any complaints yet.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-800/80">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left">Issue</th>
                      <th className="px-3 py-2 text-left">Severity</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td className="px-3 py-2 text-slate-100">
                          <div className="font-medium">{c.issueType}</div>
                          <div className="text-xs text-slate-400">
                            {c.description?.slice(0, 80)}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <span className="rounded-full bg-slate-800/90 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200">
                            {c.severity}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-300">
                          {new Date(c.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
