import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/common/Card";
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

  return (
    <AppLayout>
      <div className="space-y-5">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-slate-50">
            Hi, {user?.name ?? "Student"} 👋
          </h1>
          <p className="text-xs text-slate-400">
            Track your current room, hostel allocation, and complaint SLA in one
            place.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Hostel Allocation"
            subtitle="Your current room & occupancy"
            className="md:col-span-2"
          >
            {loadingAlloc ? (
              <p className="text-sm text-slate-400">Loading allocation...</p>
            ) : allocation ? (
              <div className="flex flex-wrap justify-between gap-4 text-sm">
                <InfoBlock label="Hostel" value={allocation.hostelName} big />
                <InfoBlock
                  label="Room"
                  value={allocation.roomNumber}
                  extra={`(${allocation.occupancy}/${allocation.capacity} occupants)`}
                />
                <InfoBlock
                  label="Allocated at"
                  value={new Date(allocation.allocatedAt).toLocaleString()}
                />
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                {allocationError ||
                  "You don’t have an allocation yet. Once admin runs the allocation algorithm, your details will appear here."}
              </p>
            )}
          </Card>

          <Card title="Complaints snapshot" subtitle="Your current SLA status">
            {loadingComplaints ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : (
              <div className="space-y-2 text-xs">
                <Row
                  label="Open complaints"
                  value={
                    recentComplaints.filter(
                      (c) =>
                        c.status === "PENDING" || c.status === "IN_PROGRESS"
                    ).length
                  }
                />
                <Row
                  label="Resolved (last 30 days)"
                  value={
                    recentComplaints.filter((c) => c.status === "RESOLVED")
                      .length
                  }
                />
                <Row
                  label="Escalated"
                  value={
                    recentComplaints.filter((c) => c.status === "ESCALATED")
                      .length
                  }
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoBlock({ label, value, extra, big }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div
        className={`${
          big ? "text-base" : "text-sm"
        } font-semibold text-slate-50`}
      >
        {value}{" "}
        {extra && (
          <span className="text-xs text-slate-400 font-normal">{extra}</span>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-100">{value}</span>
    </div>
  );
}
