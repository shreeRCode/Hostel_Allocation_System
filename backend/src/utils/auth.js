const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fail fast on boot rather than silently signing/verifying with `undefined`,
// which would either throw per-request or (with a fallback) be insecure.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is required but not set. " +
      "Set a strong random secret in the environment before starting the server."
  );
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { hashPassword, comparePassword, generateToken };