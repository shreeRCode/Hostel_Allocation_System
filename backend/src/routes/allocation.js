const express = require("express");
const prisma = require("../config/prisma");
const {
  authMiddleware,
  requireAdmin,
} = require("../middleware/authMiddleware");
const { runAllocation } = require("../services/allocationService"); // ✅ FIXED: Destructure import

const router = express.Router();

// GET ALLOCATIONS — ADMIN ONLY
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const allocations = await prisma.allocation.findMany({
      where: {
        room: { hostelId: req.user.hostelId },
      },
      include: {
        student: true,
        room: { include: { hostel: true } },
      },
    });

    res.json({ allocations });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// RUN ALLOCATION — ADMIN ONLY
router.post("/run", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const result = await runAllocation(); // ✅ Now works correctly
    res.json({ success: true, message: result.message, result });
  } catch (err) {
    console.error("Allocation error:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
