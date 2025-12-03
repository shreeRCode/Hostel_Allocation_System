import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
import { apiRequest } from "../../services/apiClient";

export default function AdminHostelsPage() {
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHostel = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/hostels", { auth: true });
      setHostel(data?.hostels?.[0] || null);
    } catch {
      setHostel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostel();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-5">
        <header>
          <h1 className="text-xl font-semibold text-white">My Hostel</h1>
          <p className="text-xs text-slate-400">
            You can only manage the hostel assigned to you.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : !hostel ? (
          <p className="text-sm text-slate-400">No hostel assigned.</p>
        ) : (
          <Card title={hostel.name} subtitle="Hostel details">
            <p className="text-sm text-slate-300">
              Gender Allowed: {hostel.genderAllowed}
            </p>
            <p className="text-sm text-slate-300">
              Capacity: {hostel.capacity}
            </p>

            <a
              href={`/admin/hostels/${hostel.id}/rooms`}
              className="text-indigo-400 text-xs mt-3 inline-block"
            >
              Manage Rooms →
            </a>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
