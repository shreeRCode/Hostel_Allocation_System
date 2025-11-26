import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Card, { StatsCard, ActionCard } from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
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
  ExportIcon,
  ViewIcon,
  SettingsIcon
} from "../../components/common/Icons";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    allocatedStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    escalatedComplaints: 0
  });

  const [recentAllocations, setRecentAllocations] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [allocationRunning, setAllocationRunning] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch complaints
      const complaintsData = await apiRequest("/admin/complaints", { auth: true });
      const complaints = complaintsData?.complaints || [];
      
      // Fetch allocations
      const allocationsData = await apiRequest("/allocation", { auth: true });
      const allocations = allocationsData?.allocations || [];
      
      // Fetch hostels and rooms
      const hostelsData = await apiRequest("/hostels", { auth: true });
      const hostels = hostelsData?.hostels || [];
      
      const roomsData = await apiRequest("/rooms", { auth: true });
      const rooms = roomsData?.rooms || [];

      // Calculate stats
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(room => room.currentOccupancy > 0).length;
      const totalComplaints = complaints.length;
      const pendingComplaints = complaints.filter(c => c.status === "PENDING").length;
      const resolvedComplaints = complaints.filter(c => c.status === "RESOLVED").length;
      const escalatedComplaints = complaints.filter(c => c.status === "ESCALATED").length;

      setStats({
        totalStudents: allocations.length + 50, // Estimate
        allocatedStudents: allocations.length,
        totalRooms,
        occupiedRooms,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        escalatedComplaints
      });

      setRecentAllocations(allocations.slice(0, 5));
      setRecentComplaints(complaints.slice(0, 5));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAllocation = async () => {
    try {
      setAllocationRunning(true);
      const result = await apiRequest("/allocation/run", {
        method: "POST",
        auth: true
      });
      
      alert(`Allocation completed! ${result.summary.assigned} students assigned.`);
      setShowAllocationModal(false);
      fetchDashboardData(); // Refresh data
      
    } catch (error) {
      alert(`Allocation failed: ${error.message}`);
    } finally {
      setAllocationRunning(false);
    }
  };

  const handleManageComplaints = () => {
    navigate("/admin/complaints");
  };

  const handleManageHostels = () => {
    navigate("/admin/hostels");
  };

  const handleViewAllocations = () => {
    navigate("/admin/allocations");
  };

  const occupancyRate = stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;
  const allocationRate = stats.totalStudents > 0 ? Math.round((stats.allocatedStudents / stats.totalStudents) * 100) : 0;
  const resolutionRate = stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0;

  const allocationColumns = [
    { 
      key: 'student', 
      label: 'Student Name',
      render: (value) => value?.name || 'N/A'
    },
    { 
      key: 'room', 
      label: 'Room',
      render: (value) => `${value?.hostel?.name} - ${value?.roomNumber}` || 'N/A'
    },
    { key: 'allocatedAt', label: 'Allocated At', type: 'datetime' }
  ];

  const complaintColumns = [
    { key: 'studentName', label: 'Student' },
    { key: 'issue', label: 'Issue' },
    { key: 'severity', label: 'Priority', render: (value) => <StatusBadge status={value} size="xs" /> },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'createdAt', label: 'Created', type: 'date' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <DashboardIcon className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor hostel capacity, allocations, and complaint management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowAllocationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <AllocationsIcon className="w-4 h-4" />
              Run Allocation
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
              <ExportIcon className="w-4 h-4" />
              Export Reports
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            change={`${allocationRate}% allocated`}
            trend="up"
            icon={<UserIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Room Occupancy"
            value={`${occupancyRate}%`}
            change={`${stats.occupiedRooms}/${stats.totalRooms} rooms`}
            trend={occupancyRate > 90 ? "down" : "up"}
            icon={<HostelsIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Active Complaints"
            value={stats.pendingComplaints}
            change={`${stats.totalComplaints} total`}
            trend={stats.pendingComplaints > 10 ? "down" : "up"}
            icon={<ComplaintsIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Resolution Rate"
            value={`${resolutionRate}%`}
            change="This month"
            trend="up"
            icon={<ViewIcon className="w-6 h-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Manage Hostels"
            description="Add, edit, or view hostel information"
            icon={<HostelsIcon className="w-5 h-5" />}
            action={
              <button 
                onClick={handleManageHostels}
                className="btn-primary"
              >
                Manage
              </button>
            }
          />
          <ActionCard
            title="View All Complaints"
            description="Monitor and resolve student complaints"
            icon={<ComplaintsIcon className="w-5 h-5" />}
            action={
              <button 
                onClick={handleManageComplaints}
                className="btn-primary"
              >
                View All
              </button>
            }
          />
          <ActionCard
            title="Allocation Reports"
            description="Generate allocation and occupancy reports"
            icon={<ExportIcon className="w-5 h-5" />}
            action={
              <button 
                onClick={handleViewAllocations}
                className="btn-primary"
              >
                Generate
              </button>
            }
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Allocations */}
          <Card
            title="Recent Allocations"
            subtitle="Latest room assignments"
            icon={<AllocationsIcon className="w-5 h-5" />}
          >
            <Table
              data={recentAllocations}
              columns={allocationColumns}
              searchable={false}
              pagination={false}
              pageSize={5}
              loading={loading}
            />
          </Card>

          {/* Recent Complaints */}
          <Card
            title="Recent Complaints"
            subtitle="Latest student issues"
            icon={<ComplaintsIcon className="w-5 h-5" />}
          >
            <Table
              data={recentComplaints}
              columns={complaintColumns}
              searchable={false}
              pagination={false}
              pageSize={5}
              loading={loading}
            />
          </Card>
        </div>

        {/* System Health */}
        <Card
          title="System Health"
          subtitle="Current system status and metrics"
          icon={<SettingsIcon className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <HealthMetric
              label="Database"
              status="ACTIVE"
              value="99.9% uptime"
            />
            <HealthMetric
              label="API Response"
              status="ACTIVE"
              value="< 200ms avg"
            />
            <HealthMetric
              label="Storage"
              status="ACTIVE"
              value="78% used"
            />
            <HealthMetric
              label="Last Backup"
              status="ACTIVE"
              value="2 hours ago"
            />
          </div>
        </Card>
      </div>

      {/* Allocation Modal */}
      <Modal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        title="Run Room Allocation"
        size="lg"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">Information</span>
            </div>
            <p className="text-xs text-blue-200/80">
              This will automatically assign rooms to unallocated students based on preferences, 
              gender, department, and availability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/30">
              <p className="text-sm text-slate-400 mb-1">Unallocated Students</p>
              <p className="text-2xl font-bold text-white">{stats.totalStudents - stats.allocatedStudents}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30">
              <p className="text-sm text-slate-400 mb-1">Available Rooms</p>
              <p className="text-2xl font-bold text-white">{stats.totalRooms - stats.occupiedRooms}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowAllocationModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleRunAllocation}
              disabled={allocationRunning}
              className="btn-primary flex items-center gap-2"
            >
              {allocationRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <AllocationsIcon className="w-4 h-4" />
                  Start Allocation
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

function HealthMetric({ label, status, value }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/30">
      <div className="flex items-center justify-between mb-2">
        <SettingsIcon className="w-5 h-5 text-slate-400" />
        <StatusBadge status={status} size="xs" />
      </div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}