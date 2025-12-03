const express = require("express");
const prisma = require("../config/prisma");
const {
  authMiddleware,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ADMIN SEES ONLY THEIR HOSTEL
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { id: req.user.hostelId },
      include: { rooms: true },
    });

    res.json({ hostels: [hostel] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
