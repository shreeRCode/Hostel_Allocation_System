import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import { apiRequest } from "../../services/apiClient";

export default function AdminAllocationsPage() {
  const [allocs, setAllocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/allocation", { auth: true });
      setAllocs(data?.allocations || []);
    } catch {
      setAllocs([]);
    } finally {
      setLoading(false);
    }
  };

  const runAllocation = async () => {
    setRunning(true);
    try {
      await apiRequest("/allocation/run", { method: "POST", auth: true });
      fetchAllocations();
    } catch (err) {
      alert(err.message);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-5">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl text-white font-semibold">
              My Hostel Allocations
            </h1>
            <p className="text-xs text-slate-400">
              View and manage room allocation results.
            </p>
          </div>

          <button
            disabled={running}
            onClick={runAllocation}
            className="btn-primary"
          >
            {running ? "Running..." : "Run Allocation Algorithm"}
          </button>
        </header>

        <Card title="Allocations">
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Student</th>
                    <th className="px-3 py-2">Hostel</th>
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">Allocated At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {allocs.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2">{a.student?.name}</td>
                      <td className="px-3 py-2">{a.room?.hostel?.name}</td>
                      <td className="px-3 py-2">{a.room?.roomNumber}</td>
                      <td className="px-3 py-2">
                        {new Date(a.allocatedAt).toLocaleString()}
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
