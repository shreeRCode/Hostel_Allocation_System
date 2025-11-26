const express = require('express');
const prisma = require('../config/prisma');
const { comparePassword, generateToken } = require('../utils/auth');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin || !(await comparePassword(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: admin.id, role: 'ADMIN' });
    
    res.json({
      user: { id: admin.id, name: admin.name, role: 'ADMIN' },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Complaints (Admin)
router.get('/complaints', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        student: { select: { name: true } },
        hostel: { select: { name: true } },
        room: { select: { roomNumber: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedComplaints = complaints.map(complaint => ({
      id: complaint.id,
      studentName: complaint.student.name,
      hostelName: complaint.hostel.name,
      roomNumber: complaint.room?.roomNumber || 'N/A',
      issue: complaint.issueType,
      severity: complaint.severity,
      status: complaint.status,
      createdAt: complaint.createdAt.toISOString()
    }));

    res.json({ complaints: formattedComplaints });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Complaint Status (Admin)
router.put('/complaints/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;