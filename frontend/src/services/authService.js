import { apiRequest } from "./apiClient";

// ✅ FIXED: Student login uses /auth/login (not /student/auth/login)
export function loginStudent(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

// ✅ FIXED: Student registration uses /auth/register (not /student/auth/register)
export function registerStudent(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: payload,
  });
}

// ✅ CORRECT: Admin login uses /admin/auth/login
export function loginAdmin(credentials) {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: credentials,
  });
}
