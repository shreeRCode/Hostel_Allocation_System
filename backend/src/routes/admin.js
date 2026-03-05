const express = require("express");
const prisma = require("../config/prisma");
const { comparePassword, generateToken } = require("../utils/auth");

const router = express.Router();

// ---------------------------
// ADMIN LOGIN (FIXED)
// ---------------------------
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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
    res.status(400).json({ error: error.message });
  }
});
// ================================
// ADMIN: GET ALL STUDENTS
// ================================
router.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();

    res.json({ students });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
