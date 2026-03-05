import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import { apiRequest } from "../../services/apiClient";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/rooms", { auth: true });
      setRooms(data?.rooms || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-white">Rooms</h1>
          <p className="text-xs text-slate-400">
            View room capacity and occupancy.
          </p>
        </header>

        <Card title="Hostel Rooms">
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 text-slate-400 text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Room</th>
                  <th className="px-3 py-2 text-left">Capacity</th>
                  <th className="px-3 py-2 text-left">Occupied</th>
                  <th className="px-3 py-2 text-left">Available</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-3 py-2">{room.roomNumber}</td>
                    <td className="px-3 py-2">{room.capacity}</td>
                    <td className="px-3 py-2">{room.occupiedCount}</td>
                    <td className="px-3 py-2">
                      {room.capacity - room.occupiedCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
