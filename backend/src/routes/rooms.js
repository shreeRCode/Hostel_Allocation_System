const express = require("express");
const prisma = require("../config/prisma");
const {
  authMiddleware,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ADMIN — SEE ROOMS ONLY IN THEIR HOSTEL
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { hostelId: req.user.hostelId },
      include: { hostel: true },
    });

    res.json({ rooms });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
