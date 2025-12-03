export function saveAdminSession(user, token) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", "ADMIN");
  localStorage.setItem("hostelId", user.hostelId);
  localStorage.setItem("hostelName", user.hostelName);
}
