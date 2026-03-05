import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card, { StatsCard } from "../../components/common/Card";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import { apiRequest } from "../../services/apiClient";
import {
  DashboardIcon,
  AllocationsIcon,
  HostelsIcon,
  UserIcon,
} from "../../components/common/Icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    allocatedStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
  });

  const [recentAllocations, setRecentAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [allocationRunning, setAllocationRunning] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const studentsData = await apiRequest("/admin/students", { auth: true });
      const allocationsData = await apiRequest("/allocation", { auth: true });
      const roomsData = await apiRequest("/rooms", { auth: true });

      const students = studentsData?.students || [];
      const allocations = allocationsData?.allocations || [];
      const rooms = roomsData?.rooms || [];

      const totalRooms = rooms.length;
      const occupiedRooms = allocations.length;

      setStats({
        totalStudents: students.length,
        allocatedStudents: allocations.length,
        totalRooms,
        occupiedRooms,
      });

      setRecentAllocations(allocations.slice(0, 5));
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAllocation = async () => {
    try {
      setAllocationRunning(true);

      const result = await apiRequest("/allocation/run", {
        method: "POST",
        auth: true,
      });

      alert(result.message || "Allocation completed");

      setShowAllocationModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setAllocationRunning(false);
    }
  };

  const columns = [
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
    {
      key: "allocatedAt",
      label: "Allocated At",
      type: "datetime",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <DashboardIcon className="w-7 h-7" />
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Manage hostel rooms and student allocations.
          </p>
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
            title="Total Rooms"
            value={stats.totalRooms}
            icon={<HostelsIcon />}
          />

          <StatsCard
            title="Occupied Rooms"
            value={`${stats.occupiedRooms}/${stats.totalRooms}`}
            icon={<HostelsIcon />}
          />
        </div>

        {/* RUN ALLOCATION BUTTON */}
        <div>
          <button
            onClick={() => setShowAllocationModal(true)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium"
          >
            Run Allocation
          </button>
        </div>

        {/* RECENT ALLOCATIONS */}
        <Card title="Recent Allocations" subtitle="Latest room assignments">
          <Table
            data={recentAllocations}
            columns={columns}
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
          This will assign rooms to students based on availability.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowAllocationModal(false)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleRunAllocation}
            disabled={allocationRunning}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {allocationRunning ? "Running..." : "Start Allocation"}
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
}
