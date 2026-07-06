const express = require("express");
const prisma = require("../config/prisma");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Student Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, branch, year, gender, preferredHostel } =
      req.body;

    // --- Server-side validation (never trust the client) ---
    if (!name || !email || !password || !branch || !year || !gender) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }
    const parsedYear = parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1 || parsedYear > 5) {
      return res.status(400).json({ error: "Invalid year of study." });
    }
    if (!["MALE", "FEMALE"].includes(gender)) {
      return res.status(400).json({ error: "Invalid gender." });
    }

    const hashedPassword = await hashPassword(password);

    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        branch,
        year: parsedYear,
        gender,
        preferredHostel: preferredHostel || null,
      },
    });

    const token = generateToken({ id: student.id, role: "STUDENT" });

    res.status(201).json({
      user: { id: student.id, name: student.name, role: "STUDENT" },
      token,
    });
  } catch (error) {
    // Duplicate email — friendly message instead of leaking the Prisma error
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Student Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student || !(await comparePassword(password, student.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id: student.id, role: "STUDENT" });

    res.json({
      user: { id: student.id, name: student.name, role: "STUDENT" },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

module.exports = router;
