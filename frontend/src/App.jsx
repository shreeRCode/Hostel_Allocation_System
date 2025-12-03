import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAllocationsPage from "./pages/admin/AdminAllocationsPage";
import AdminHostelsPage from "./pages/admin/AdminHostelsPage";
import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentComplaintsPage from "./pages/student/StudentComplaintsPage";

export default function App() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 🏠 HOME PAGE - THIS WAS MISSING! */}
      <Route path="/" element={<HomePage />} />

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          user?.role === "ADMIN" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin/allocations"
        element={
          user?.role === "ADMIN" ? (
            <AdminAllocationsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin/hostels"
        element={
          user?.role === "ADMIN" ? (
            <AdminHostelsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin/complaints"
        element={
          user?.role === "ADMIN" ? (
            <AdminComplaintsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* STUDENT ROUTES */}
      <Route
        path="/student"
        element={
          user?.role === "STUDENT" ? (
            <StudentDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/student/complaints"
        element={
          user?.role === "STUDENT" ? (
            <StudentComplaintsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 - Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
