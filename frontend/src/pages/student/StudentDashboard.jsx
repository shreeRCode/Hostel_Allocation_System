import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import Card, { StatsCard, ActionCard } from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import { apiRequest } from "../../services/apiClient";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [allocation, setAllocation] = useState(null);
  const [loadingAlloc, setLoadingAlloc] = useState(true);
  const [allocationError, setAllocationError] = useState("");
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchAllocation() {
      try {
        const data = await apiRequest("/student/allocation", { auth: true });
        if (!ignore) setAllocation(data?.allocation ?? null);
      } catch (err) {
        if (!ignore) setAllocationError(err.message);
      } finally {
        if (!ignore) setLoadingAlloc(false);
      }
    }

    async function fetchComplaints() {
      try {
        const data = await apiRequest("/complaints/my", { auth: true });
        if (!ignore) setRecentComplaints(data?.complaints ?? []);
      } catch {
        if (!ignore) setRecentComplaints([]);
      } finally {
        if (!ignore) setLoadingComplaints(false);
      }
    }

    fetchAllocation();
    fetchComplaints();

    return () => {
      ignore = true;
    };
  }, []);

  const openComplaints = recentComplaints.filter(
    (c) => c.status === "PENDING" || c.status === "IN_PROGRESS"
  ).length;

  const resolvedComplaints = recentComplaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  const escalatedComplaints = recentComplaints.filter(
    (c) => c.status === "ESCALATED"
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">👋</span>
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-slate-400 mt-1">
              Here's your hostel allocation and complaint status overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-sm text-slate-300">
                🎓 Student ID: {user?.id || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Open Complaints"
            value={openComplaints}
            change={openComplaints > 0 ? "Needs attention" : "All clear"}
            trend={openComplaints > 0 ? "down" : "up"}
            icon={<span className="text-2xl">📝</span>}
          />
          <StatsCard
            title="Resolved Issues"
            value={resolvedComplaints}
            change="This month"
            trend="up"
            icon={<span className="text-2xl">✅</span>}
          />
          <StatsCard
            title="Escalated Cases"
            value={escalatedComplaints}
            change={escalatedComplaints > 0 ? "Requires follow-up" : "None"}
            trend={escalatedComplaints > 0 ? "down" : "neutral"}
            icon={<span className="text-2xl">🚨</span>}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Card */}
          <Card
            title="🏠 Current Allocation"
            subtitle="Your assigned room details"
            className="lg:col-span-2"
            loading={loadingAlloc}
            gradient={true}
          >
            {loadingAlloc ? (
              <AllocationSkeleton />
            ) : allocation ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoBlock
                    icon="🏢"
                    label="Hostel Name"
                    value={allocation.hostelName}
                    highlight={true}
                  />
                  <InfoBlock
                    icon="🚪"
                    label="Room Number"
                    value={allocation.roomNumber}
                    extra={`${allocation.occupancy}/${allocation.capacity} occupants`}
                  />
                  <InfoBlock
                    icon="📅"
                    label="Allocated On"
                    value={new Date(allocation.allocatedAt).toLocaleDateString()}
                  />
                  <InfoBlock
                    icon="👥"
                    label="Occupancy Status"
                    value={
                      allocation.occupancy === allocation.capacity
                        ? "Full"
                        : "Available"
                    }
                  />
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400">✨</span>
                    <span className="text-sm font-medium text-green-300">
                      Allocation Status: Active
                    </span>
                  </div>
                  <p className="text-xs text-green-200/80">
                    Your room allocation is confirmed and active. Contact admin for any changes.
                  </p>
                </div>
              </div>
            ) : (
              <EmptyAllocation error={allocationError} />
            )}
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <ActionCard
              title="File Complaint"
              description="Report room or hostel issues"
              icon={<span className="text-xl">📝</span>}
              action={
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Create
                </button>
              }
            />
            <ActionCard
              title="View All Complaints"
              description="Track your complaint history"
              icon={<span className="text-xl">📋</span>}
              action={
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                  View
                </button>
              }
            />
            <ActionCard
              title="Room Preferences"
              description="Update your preferences"
              icon={<span className="text-xl">⚙️</span>}
              action={
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Edit
                </button>
              }
            />
          </div>
        </div>

        {/* Recent Complaints */}
        <Card
          title="📋 Recent Complaints"
          subtitle="Your latest complaint submissions"
          loading={loadingComplaints}
        >
          {loadingComplaints ? (
            <ComplaintsSkeleton />
          ) : recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.slice(0, 5).map((complaint, index) => (
                <ComplaintItem key={index} complaint={complaint} />
              ))}
              {recentComplaints.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    View all {recentComplaints.length} complaints →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📝</span>
              <p className="text-slate-400 mb-2">No complaints filed yet</p>
              <p className="text-xs text-slate-500">
                When you file complaints, they'll appear here
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

function InfoBlock({ icon, label, value, extra, highlight = false }) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-slate-800/30'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>
      <div className="text-lg font-semibold text-white">
        {value}
        {extra && (
          <span className="text-sm text-slate-400 font-normal ml-2">
            {extra}
          </span>
        )}
      </div>
    </div>
  );
}

function ComplaintItem({ complaint }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-medium text-white">{complaint.title}</h4>
          <StatusBadge status={complaint.status} size="xs" />
        </div>
        <p className="text-sm text-slate-400 line-clamp-1">
          {complaint.description}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {new Date(complaint.createdAt).toLocaleDateString()}
        </p>
      </div>
      <button className="text-slate-400 hover:text-white transition-colors">
        <span className="text-lg">→</span>
      </button>
    </div>
  );
}

function EmptyAllocation({ error }) {
  return (
    <div className="text-center py-8">
      <span className="text-4xl mb-4 block">🏠</span>
      <p className="text-slate-400 mb-2">
        {error || "No allocation assigned yet"}
      </p>
      <p className="text-xs text-slate-500">
        Your room will be assigned after the allocation process is completed
      </p>
    </div>
  );
}

function AllocationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-slate-800/30 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function ComplaintsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-slate-800/30 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}