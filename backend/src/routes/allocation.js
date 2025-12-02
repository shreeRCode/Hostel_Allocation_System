const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');
const allocationService = require('../services/allocationService');

const router = express.Router();

// Get All Allocations
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const allocations = await prisma.allocation.findMany({
      where: { active: true },
      include: {
        student: { select: { name: true, email: true, branch: true, year: true } },
        room: {
          include: {
            hostel: { select: { name: true } }
          }
        }
      },
      orderBy: { allocatedAt: 'desc' }
    });

    res.json({ allocations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Run Allocation Algorithm
router.post('/run', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const result = await allocationService.allocateRooms();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Hostel Occupancy
router.get('/occupancy', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const occupancy = await allocationService.getHostelOccupancy();
    res.json({ occupancy });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;