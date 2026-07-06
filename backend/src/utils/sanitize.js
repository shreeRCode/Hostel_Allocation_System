// Fields that are always safe to expose for a Student record.
// Excludes `password` (bcrypt hash) which must never leave the server.
const STUDENT_SELECT = {
  id: true,
  name: true,
  email: true,
  branch: true,
  year: true,
  gender: true,
  preferredHostel: true,
  createdAt: true,
  updatedAt: true,
};

module.exports = { STUDENT_SELECT };
