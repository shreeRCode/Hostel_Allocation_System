import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import { apiRequest } from "../../services/apiClient";
import { HostelsIcon } from "../../components/common/Icons";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/rooms", { auth: true });
      setRooms(data?.rooms || []);
    } catch (err) {
      setError(err.message || "Failed to load rooms.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const columns = [
    { key: "roomNumber", label: "Room" },
    { key: "capacity", label: "Capacity" },
    { key: "occupiedCount", label: "Occupied" },
    {
      key: "available",
      label: "Available",
      sortable: false,
      render: (_, item) => item.capacity - item.occupiedCount,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-white">Rooms</h1>
          <p className="text-xs text-slate-400">
            View room capacity and occupancy.
          </p>
        </header>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Card title="Hostel Rooms" icon={<HostelsIcon className="w-5 h-5" />}>
          <Table
            data={rooms}
            columns={columns}
            loading={loading}
            emptyMessage="No rooms found."
          />
        </Card>
      </div>
    </AppLayout>
  );
}
