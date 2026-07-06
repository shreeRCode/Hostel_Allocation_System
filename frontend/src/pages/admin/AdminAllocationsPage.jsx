import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import { apiRequest } from "../../services/apiClient";
import { AllocationsIcon } from "../../components/common/Icons";

export default function AdminAllocationsPage() {
  const [allocs, setAllocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const fetchAllocations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/allocation", { auth: true });
      setAllocs(data?.allocations || []);
    } catch (err) {
      setError(err.message || "Failed to load allocations.");
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

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (_, item) => item.student?.name || "N/A",
    },
    {
      key: "hostel",
      label: "Hostel",
      render: (_, item) => item.room?.hostel?.name || "N/A",
    },
    {
      key: "room",
      label: "Room",
      render: (_, item) => item.room?.roomNumber || "N/A",
    },
    { key: "allocatedAt", label: "Allocated At", type: "datetime" },
  ];

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

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Card title="Allocations" icon={<AllocationsIcon className="w-5 h-5" />}>
          <Table
            data={allocs}
            columns={columns}
            loading={loading}
            emptyMessage="No allocations yet. Run the allocation algorithm to assign rooms."
          />
        </Card>
      </div>
    </AppLayout>
  );
}
