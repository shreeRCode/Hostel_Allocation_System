import { apiRequest } from "./apiClient";

const TOKEN_KEY = "hostel_auth";

export function getAuthToken() {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.token;
  } catch {
    return null;
  }
}

// STUDENT
export function loginStudent(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function registerStudent(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: payload,
  });
}

// ADMIN
export function loginAdmin(credentials) {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: credentials,
  });
}
