import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import { apiRequest } from "../../services/apiClient";

export default function AdminHostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/hostels", { auth: true });
      setHostels(data?.hostels ?? []);
    } catch {
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-slate-50">
            Hostels Overview
          </h1>
          <p className="text-xs text-slate-400">
            View all hostels and monitor their total capacity.
          </p>
        </header>

        <Card title="All Hostels" subtitle="Select hostel to manage rooms">
          {loading ? (
            <p className="text-sm text-slate-400">Loading hostels...</p>
          ) : hostels.length === 0 ? (
            <p className="text-sm text-slate-400">No hostels available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {hostels.map((h) => (
                <div
                  key={h.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:bg-slate-900/80 transition"
                >
                  <h2 className="text-slate-100 font-semibold text-lg">
                    {h.name}
                  </h2>
                  <p className="text-xs text-slate-400 mb-2">
                    Allowed gender: {h.genderAllowed}
                  </p>

                  <div className="text-sm text-slate-300">
                    <div>
                      Capacity:{" "}
                      <span className="font-semibold">{h.capacity}</span>
                    </div>
                    <div>
                      Distance:{" "}
                      <span className="font-semibold">{h.distance}m</span>
                    </div>
                  </div>

                  <a
                    href={`/admin/hostels/${h.id}/rooms`}
                    className="mt-3 inline-block text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Manage rooms →
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
