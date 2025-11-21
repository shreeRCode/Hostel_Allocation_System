import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar userType="ADMIN" />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="text-gray-400 mt-1">
            Monitor hostel capacity, allocations, and SLA compliance at a
            glance.
          </p>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Occupancy */}
            <Card title="Occupancy" subtitle="Overall hostel utilisation">
              <p className="text-gray-300 mt-2">
                View total beds, filled beds, and available rooms across all
                hostels.
              </p>
              <StatusBadge status="ACTIVE" />
            </Card>

            {/* Active Complaints */}
            <Card title="Active complaints" subtitle="Across all hostels">
              <p className="text-gray-300 mt-2">
                Track open, escalated, and resolved complaints with SLA timers.
              </p>
              <StatusBadge status="PENDING" />
            </Card>

            {/* Quick Actions */}
            <Card title="Quick actions" subtitle="Primary workflows">
              <ul className="mt-2 space-y-2 text-gray-300">
                <li>• Run allocation algorithm</li>
                <li>• Export allocation list</li>
                <li>• Export SLA compliance report</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
