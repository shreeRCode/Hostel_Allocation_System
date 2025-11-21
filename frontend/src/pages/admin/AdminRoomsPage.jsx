import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import { apiRequest } from "../../services/apiClient";
import { useParams } from "react-router-dom";

export default function AdminRoomsPage() {
  const { hostelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/rooms?hostelId=${hostelId}`, {
        auth: true,
      });
      setRooms(data?.rooms ?? []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [hostelId]);

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-slate-50">
            Rooms in Hostel #{hostelId}
          </h1>
          <a
            href="/admin/hostels"
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            ← Back to hostels
          </a>
        </header>

        <Card title="Rooms" subtitle="Manage occupancy & capacity">
          {loading ? (
            <p className="text-sm text-slate-400">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p className="text-sm text-slate-400">No rooms found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {rooms.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <h2 className="text-slate-100 font-semibold text-lg">
                    Room {r.roomNumber}
                  </h2>
                  <p className="text-xs text-slate-400 mb-2">
                    Capacity: {r.capacity}
                  </p>

                  <div className="text-sm text-slate-300">
                    <span className="font-semibold">
                      {r.currentOccupancy}/{r.capacity}
                    </span>{" "}
                    occupants
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
