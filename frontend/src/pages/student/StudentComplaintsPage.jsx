import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card, { StatsCard } from "../../components/common/Card";
import StatusBadge, { PriorityBadge } from "../../components/common/StatusBadge";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import { apiRequest } from "../../services/apiClient";
import { ComplaintsIcon, PlusIcon, ViewIcon, EditIcon, RefreshIcon } from "../../components/common/Icons";

export default function StudentComplaintsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    category: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const categories = [
    "Plumbing", "Electrical", "HVAC", "Network", "Cleanliness", 
    "Security", "Furniture", "Maintenance", "Other"
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/complaints/my", { auth: true });
      setComplaints(data?.complaints ?? []);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      // Keep existing complaints on error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await apiRequest("/complaints", {
        method: "POST",
        body: form,
        auth: true,
      });
      
      // Add new complaint to the list
      if (response.complaint) {
        setComplaints(prev => [response.complaint, ...prev]);
      }
      
      // Reset form and close modal
      setForm({ title: "", description: "", priority: "MEDIUM", category: "" });
      setShowCreateModal(false);
      
      // Show success message
      alert("Complaint submitted successfully!");
      
    } catch (err) {
      alert(err.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchComplaints();
  };

  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "PENDING").length,
    inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter(c => c.status === "RESOLVED").length,
    escalated: complaints.filter(c => c.status === "ESCALATED").length
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Issue Title',
      render: (value, item) => (
        <div>
          <p className="font-medium text-white">{value}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => (
        <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300">
          {value}
        </span>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value) => <PriorityBadge priority={value} size="xs" />
    },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, item) => (
        <button
          onClick={() => setSelectedComplaint(item)}
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          <ViewIcon className="w-4 h-4" />
          View
        </button>
      )
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ComplaintsIcon className="w-8 h-8" />
              My Complaints
            </h1>
            <p className="text-slate-400 mt-1">
              Track and manage your hostel-related issues and requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              New Complaint
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatsCard
            title="Total"
            value={complaintStats.total}
            icon={<ComplaintsIcon className="w-5 h-5" />}
          />
          <StatsCard
            title="Pending"
            value={complaintStats.pending}
            trend={complaintStats.pending > 0 ? "down" : "neutral"}
            icon={<EditIcon className="w-5 h-5" />}
          />
          <StatsCard
            title="In Progress"
            value={complaintStats.inProgress}
            trend="up"
            icon={<RefreshIcon className="w-5 h-5" />}
          />
          <StatsCard
            title="Resolved"
            value={complaintStats.resolved}
            trend="up"
            icon={<ViewIcon className="w-5 h-5" />}
          />
          <StatsCard
            title="Escalated"
            value={complaintStats.escalated}
            trend={complaintStats.escalated > 0 ? "down" : "neutral"}
            icon={<EditIcon className="w-5 h-5" />}
          />
        </div>

        {/* Complaints Table */}
        <Card
          title="All Complaints"
          subtitle="Your complaint history and current status"
          icon={<ComplaintsIcon className="w-5 h-5" />}
        >
          <Table
            data={complaints}
            columns={columns}
            loading={loading}
            emptyMessage="No complaints filed yet. Click 'New Complaint' to get started."
          />
        </Card>
      </div>

      {/* Create Complaint Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Complaint"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Issue Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Priority Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map(priority => (
                <label key={priority} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={form.priority === priority}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <PriorityBadge priority={priority} size="xs" />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Provide detailed information about the issue, including location, timing, and any other relevant details..."
            />
            <p className="form-help">
              The more details you provide, the faster we can resolve your issue.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Complaint Details"
        size="lg"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedComplaint.title}
                </h3>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedComplaint.status} />
                  <PriorityBadge priority={selectedComplaint.priority} />
                  <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300">
                    {selectedComplaint.category}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Description</h4>
              <p className="text-slate-300 bg-slate-800/30 p-4 rounded-xl">
                {selectedComplaint.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2">Created</h4>
                <p className="text-slate-300">
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Last Updated</h4>
                <p className="text-slate-300">
                  {new Date(selectedComplaint.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}