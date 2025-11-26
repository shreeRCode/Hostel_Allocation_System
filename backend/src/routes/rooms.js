const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Rooms by Hostel
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { hostelId } = req.query;
    
    const rooms = await prisma.room.findMany({
      where: hostelId ? { hostelId: parseInt(hostelId) } : {},
      include: {
        hostel: true,
        allocations: {
          where: { active: true },
          include: { student: { select: { name: true } } }
        }
      }
    });

    res.json({ rooms });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;