const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Hostels
router.get('/', authMiddleware, async (req, res) => {
  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        rooms: true,
        _count: {
          select: { rooms: true }
        }
      }
    });

    res.json({ hostels });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;