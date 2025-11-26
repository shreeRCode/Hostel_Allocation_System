const express = require('express');
const prisma = require('../config/prisma');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

const router = express.Router();

// Student Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch, year, gender } = req.body;
    
    const hashedPassword = await hashPassword(password);
    
    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        branch,
        year: parseInt(year),
        gender
      }
    });

    const token = generateToken({ id: student.id, role: 'STUDENT' });
    
    res.status(201).json({
      user: { id: student.id, name: student.name, role: 'STUDENT' },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student || !(await comparePassword(password, student.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: student.id, role: 'STUDENT' });
    
    res.json({
      user: { id: student.id, name: student.name, role: 'STUDENT' },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;