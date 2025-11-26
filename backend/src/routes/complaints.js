const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware, requireStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Student's Complaints
router.get('/my', authMiddleware, requireStudent, async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const formattedComplaints = complaints.map(complaint => ({
      id: complaint.id,
      title: complaint.issueType,
      description: complaint.description,
      priority: complaint.severity,
      category: complaint.category,
      status: complaint.status,
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString()
    }));

    res.json({ complaints: formattedComplaints });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create New Complaint
router.post('/', authMiddleware, requireStudent, async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    
    // Get student's allocation to find hostel and room
    const allocation = await prisma.allocation.findFirst({
      where: { 
        studentId: req.user.id,
        active: true
      },
      include: { room: true }
    });

    if (!allocation) {
      return res.status(400).json({ error: 'No active allocation found' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        issueType: title,
        description,
        severity: priority,
        category,
        studentId: req.user.id,
        hostelId: allocation.room.hostelId,
        roomId: allocation.roomId
      }
    });

    res.status(201).json({ 
      message: 'Complaint created successfully',
      complaint: {
        id: complaint.id,
        title: complaint.issueType,
        description: complaint.description,
        priority: complaint.severity,
        category: complaint.category,
        status: complaint.status,
        createdAt: complaint.createdAt.toISOString(),
        updatedAt: complaint.updatedAt.toISOString()
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;