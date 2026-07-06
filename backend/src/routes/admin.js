const express = require("express");
const prisma = require("../config/prisma");
const { comparePassword, generateToken } = require("../utils/auth");
const { STUDENT_SELECT } = require("../utils/sanitize");
const {
  authMiddleware,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ---------------------------
// ADMIN LOGIN (FIXED)
// ---------------------------
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
      include: { hostel: true },
    });

    if (!admin || !(await comparePassword(password, admin.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔥 FORCE role to ADMIN for frontend compatibility
    const token = generateToken({
      id: admin.id,
      role: "ADMIN", // ← FIXED
      hostelId: admin.hostelId, // ← NEEDED FOR FILTERING
    });

    res.json({
      user: {
        id: admin.id,
        name: admin.name,
        role: "ADMIN", // ← FIXED
        hostelId: admin.hostelId,
        hostelName: admin.hostel?.name,
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});
// ================================
// ADMIN: GET ALL STUDENTS
// (auth + admin only; never returns password hashes)
// ================================
router.get("/students", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      select: STUDENT_SELECT,
      orderBy: { createdAt: "desc" },
    });

    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students." });
  }
});

module.exports = router;
