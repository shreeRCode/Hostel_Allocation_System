const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware, requireStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Student Allocation
router.get('/allocation', authMiddleware, requireStudent, async (req, res) => {
  try {
    const allocation = await prisma.allocation.findFirst({
      where: { 
        studentId: req.user.id,
        active: true
      },
      include: {
        room: {
          include: {
            hostel: true
          }
        }
      }
    });

    if (!allocation) {
      return res.json({ allocation: null });
    }

    res.json({
      allocation: {
        id: allocation.id,
        hostelName: allocation.room.hostel.name,
        roomNumber: allocation.room.roomNumber,
        occupancy: allocation.room.currentOccupancy,
        capacity: allocation.room.capacity,
        allocatedAt: allocation.allocatedAt.toISOString()
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;