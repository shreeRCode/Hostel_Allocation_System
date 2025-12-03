const express = require("express");
const prisma = require("../config/prisma");
const {
  authMiddleware,
  requireStudent,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================================
//  STUDENT: GET MY COMPLAINTS
// ===============================================
router.get("/my", authMiddleware, requireStudent, async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    const formatted = complaints.map((c) => ({
      id: c.id,
      title: c.issueType,
      description: c.description,
      priority: c.severity,
      category: c.category,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json({ complaints: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================================
//  STUDENT: CREATE COMPLAINT
// ===============================================
router.post("/", authMiddleware, requireStudent, async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    // Find the student's room
    const allocation = await prisma.allocation.findFirst({
      where: {
        studentId: req.user.id,
        active: true,
      },
      include: { room: true },
    });

    if (!allocation) {
      return res
        .status(400)
        .json({ error: "You are not allocated to any room." });
    }

    const created = await prisma.complaint.create({
      data: {
        issueType: title,
        description,
        severity: priority,
        category,
        studentId: req.user.id,
        hostelId: allocation.room.hostelId,
        roomId: allocation.roomId,
      },
    });

    res.status(201).json({
      message: "Complaint created successfully",
      complaint: created,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================================
//  ADMIN: GET ALL COMPLAINTS FOR THEIR HOSTEL ONLY
// ===============================================
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const adminHostelId = req.user.hostelId;

    if (!adminHostelId) {
      return res
        .status(403)
        .json({ error: "Admin not assigned to any hostel." });
    }

    const complaints = await prisma.complaint.findMany({
      where: { hostelId: adminHostelId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        room: { select: { roomNumber: true } },
        hostel: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ FIXED: Format to match frontend expectations
    const formatted = complaints.map((c) => ({
      id: c.id,
      studentName: c.student?.name || "Unknown",
      hostelName: c.hostel?.name || "Unknown",
      roomNumber: c.room?.roomNumber || "N/A",
      issueType: c.issueType,
      description: c.description,
      severity: c.severity,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json({ complaints: formatted });
  } catch (err) {
    console.error("Complaint fetch error:", err);
    res.status(500).json({ error: "Failed to fetch complaints." });
  }
});

// ===============================================
//  ADMIN: UPDATE COMPLAINT STATUS
// ===============================================
router.put("/:id/status", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const complaintId = parseInt(req.params.id);
    const adminHostelId = req.user.hostelId;

    // Ensure admin can update ONLY their hostel's complaints
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint || complaint.hostelId !== adminHostelId) {
      return res.status(403).json({ error: "Access denied." });
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
    });

    res.json({ message: "Status updated successfully", complaint: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
