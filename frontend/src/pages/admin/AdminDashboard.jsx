import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card, { StatsCard } from "../../components/common/Card";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import { apiRequest } from "../../services/apiClient";
import {
  DashboardIcon,
  ComplaintsIcon,
  HostelsIcon,
  AllocationsIcon,
  UserIcon,
  RefreshIcon,
} from "../../components/common/Icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    allocatedStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    escalatedComplaints: 0,
  });

  const [recentAllocations, setRecentAllocations] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [allocationRunning, setAllocationRunning] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ FIXED: Correct API paths
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: Use /complaints (not /admin/complaints)
      const complaintsData = await apiRequest("/complaints", {
        auth: true,
      });

      const allocationsData = await apiRequest("/allocation", {
        auth: true,
      });

      const roomsData = await apiRequest("/rooms", {
        auth: true,
      });

      const complaints = complaintsData?.complaints || [];
      const allocations = allocationsData?.allocations || [];
      const rooms = roomsData?.rooms || [];

      // Stats
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter((r) => r.occupiedCount > 0).length;

      const pending = complaints.filter((c) => c.status === "PENDING").length;
      const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
      const escalated = complaints.filter(
        (c) => c.status === "ESCALATED"
      ).length;

      setStats({
        totalStudents: allocations.length,
        allocatedStudents: allocations.length,
        totalRooms,
        occupiedRooms,
        totalComplaints: complaints.length,
        pendingComplaints: pending,
        resolvedComplaints: resolved,
        escalatedComplaints: escalated,
      });

      setRecentAllocations(allocations.slice(0, 5));
      setRecentComplaints(complaints.slice(0, 5));
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Correct allocation run
  const handleRunAllocation = async () => {
    try {
      setAllocationRunning(true);

      const result = await apiRequest("/allocation/run", {
        method: "POST",
        auth: true,
      });

      alert(result.message || "Allocation completed!");
      setShowAllocationModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || "Allocation failed");
    } finally {
      setAllocationRunning(false);
    }
  };

  const allocationColumns = [
    {
      key: "student",
      label: "Student",
      render: (_, item) => item?.student?.name || "N/A",
    },
    {
      key: "email",
      label: "Email",
      render: (_, item) => item?.student?.email || "N/A",
    },
    {
      key: "hostel",
      label: "Hostel",
      render: (_, item) => item?.room?.hostel?.name || "N/A",
    },
    {
      key: "room",
      label: "Room",
      render: (_, item) => item?.room?.roomNumber || "N/A",
    },
    { key: "allocatedAt", label: "Allocated At", type: "datetime" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <DashboardIcon className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-slate-400">
              Manage rooms, complaints, and hostel allocations.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={fetchDashboardData} className="btn-secondary">
              <RefreshIcon className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={() => setShowAllocationModal(true)}
              className="btn-primary"
            >
              <AllocationsIcon className="w-4 h-4" /> Run Allocation
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<UserIcon />}
          />
          <StatsCard
            title="Allocated"
            value={stats.allocatedStudents}
            icon={<AllocationsIcon />}
          />
          <StatsCard
            title="Rooms Occupied"
            value={`${stats.occupiedRooms}/${stats.totalRooms}`}
            icon={<HostelsIcon />}
          />
          <StatsCard
            title="Pending Complaints"
            value={stats.pendingComplaints}
            icon={<ComplaintsIcon />}
          />
        </div>

        {/* RECENT ALLOCATIONS */}
        <Card
          title="Recent Allocations"
          subtitle="Latest room assignments"
          icon={<AllocationsIcon className="w-5 h-5" />}
        >
          <Table
            data={recentAllocations}
            columns={allocationColumns}
            loading={loading}
            pageSize={5}
          />
        </Card>
      </div>

      {/* ALLOCATION MODAL */}
      <Modal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        title="Run Allocation"
      >
        <p className="text-sm text-slate-300 mb-4">
          This assigns rooms to students based on preferences and availability.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="btn-secondary"
            onClick={() => setShowAllocationModal(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleRunAllocation}
            className="btn-primary"
            disabled={allocationRunning}
          >
            {allocationRunning ? "Running..." : "Start Allocation"}
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
}
