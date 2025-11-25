import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card, { StatsCard, ActionCard } from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    allocatedStudents: 1180,
    totalRooms: 320,
    occupiedRooms: 295,
    totalComplaints: 45,
    pendingComplaints: 12,
    resolvedComplaints: 28,
    escalatedComplaints: 5
  });

  const [recentAllocations, setRecentAllocations] = useState([
    {
      id: 1,
      studentName: "John Doe",
      hostelName: "Alpha Block",
      roomNumber: "A-101",
      allocatedAt: "2024-01-15T10:30:00Z",
      status: "ALLOCATED"
    },
    {
      id: 2,
      studentName: "Jane Smith",
      hostelName: "Beta Block",
      roomNumber: "B-205",
      allocatedAt: "2024-01-15T11:15:00Z",
      status: "ALLOCATED"
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      hostelName: "Gamma Block",
      roomNumber: "G-301",
      allocatedAt: "2024-01-15T12:00:00Z",
      status: "PENDING"
    }
  ]);

  const [recentComplaints, setRecentComplaints] = useState([
    {
      id: 1,
      title: "Water leakage in bathroom",
      studentName: "Alice Brown",
      roomNumber: "A-205",
      status: "IN_PROGRESS",
      priority: "HIGH",
      createdAt: "2024-01-14T09:30:00Z"
    },
    {
      id: 2,
      title: "AC not working",
      studentName: "Bob Wilson",
      roomNumber: "B-101",
      status: "PENDING",
      priority: "MEDIUM",
      createdAt: "2024-01-14T14:20:00Z"
    }
  ]);

  const [showAllocationModal, setShowAllocationModal] = useState(false);

  const allocationColumns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'hostelName', label: 'Hostel' },
    { key: 'roomNumber', label: 'Room' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'allocatedAt', label: 'Allocated At', type: 'datetime' }
  ];

  const complaintColumns = [
    { key: 'title', label: 'Issue' },
    { key: 'studentName', label: 'Student' },
    { key: 'roomNumber', label: 'Room' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'priority', label: 'Priority', render: (value) => (
      <StatusBadge status={value} size="xs" />
    )},
    { key: 'createdAt', label: 'Created', type: 'date' }
  ];

  const occupancyRate = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);
  const allocationRate = Math.round((stats.allocatedStudents / stats.totalStudents) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">📊</span>
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor hostel capacity, allocations, and complaint management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAllocationModal(true)}
              className="btn-primary"
            >
              🎯 Run Allocation
            </button>
            <button className="btn-secondary">
              📊 Export Reports
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
            icon={<span className="text-2xl">🎓</span>}
          />
          <StatsCard
            title="Room Occupancy"
            value={`${occupancyRate}%`}
            change={`${stats.occupiedRooms}/${stats.totalRooms} rooms`}
            trend={occupancyRate > 90 ? "down" : "up"}
            icon={<span className="text-2xl">🏠</span>}
          />
          <StatsCard
            title="Active Complaints"
            value={stats.pendingComplaints}
            change={`${stats.totalComplaints} total`}
            trend={stats.pendingComplaints > 10 ? "down" : "up"}
            icon={<span className="text-2xl">📝</span>}
          />
          <StatsCard
            title="Resolution Rate"
            value={`${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%`}
            change="This month"
            trend="up"
            icon={<span className="text-2xl">✅</span>}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Manage Hostels"
            description="Add, edit, or view hostel information"
            icon={<span className="text-xl">🏢</span>}
            action={
              <button className="btn-primary">
                Manage
              </button>
            }
          />
          <ActionCard
            title="View All Complaints"
            description="Monitor and resolve student complaints"
            icon={<span className="text-xl">🎫</span>}
            action={
              <button className="btn-primary">
                View All
              </button>
            }
          />
          <ActionCard
            title="Allocation Reports"
            description="Generate allocation and occupancy reports"
            icon={<span className="text-xl">📈</span>}
            action={
              <button className="btn-primary">
                Generate
              </button>
            }
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Allocations */}
          <Card
            title="📋 Recent Allocations"
            subtitle="Latest room assignments"
          >
            <Table
              data={recentAllocations}
              columns={allocationColumns}
              searchable={false}
              pagination={false}
              pageSize={5}
            />
          </Card>

          {/* Recent Complaints */}
          <Card
            title="🎫 Recent Complaints"
            subtitle="Latest student issues"
          >
            <Table
              data={recentComplaints}
              columns={complaintColumns}
              searchable={false}
              pagination={false}
              pageSize={5}
            />
          </Card>
        </div>

        {/* System Health */}
        <Card
          title="🔧 System Health"
          subtitle="Current system status and metrics"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <HealthMetric
              label="Database"
              status="ACTIVE"
              value="99.9% uptime"
              icon="💾"
            />
            <HealthMetric
              label="API Response"
              status="ACTIVE"
              value="< 200ms avg"
              icon="⚡"
            />
            <HealthMetric
              label="Storage"
              status="ACTIVE"
              value="78% used"
              icon="💿"
            />
            <HealthMetric
              label="Last Backup"
              status="ACTIVE"
              value="2 hours ago"
              icon="🔄"
            />
          </div>
        </Card>
      </div>

      {/* Allocation Modal */}
      <Modal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        title="🎯 Run Room Allocation"
        size="lg"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">ℹ️</span>
              <span className="text-sm font-medium text-blue-300">
                Allocation Algorithm
              </span>
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
              onClick={() => {
                // Run allocation logic here
                setShowAllocationModal(false);
              }}
              className="btn-primary"
            >
              🚀 Start Allocation
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

function HealthMetric({ label, status, value, icon }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
        <StatusBadge status={status} size="xs" />
      </div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}