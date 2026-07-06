const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // 401 (not 400) so the client can detect an expired/invalid session
    // and redirect to login.
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

const requireStudent = (req, res, next) => {
  if (req.user.role !== "STUDENT") {
    return res
      .status(403)
      .json({ error: "Access denied. Student role required." });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "HOSTEL_ADMIN" && req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Access denied. Admin role required." });
  }
  next();
};

module.exports = { authMiddleware, requireStudent, requireAdmin };
