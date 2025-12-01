// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// import LoginPage from "./pages/auth/LoginPage.jsx";
// import RegisterPage from "./pages/auth/RegisterPage.jsx";

// import StudentDashboard from "./pages/student/StudentDashboard.jsx";
// import StudentComplaintsPage from "./pages/student/StudentComplaintsPage.jsx";

// import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage.jsx";
// import AdminHostelsPage from "./pages/admin/AdminHostelsPage.jsx";
// import AdminRoomsPage from "./pages/admin/AdminRoomsPage.jsx";
// import AdminAllocationsPage from "./pages/admin/AdminAllocationsPage.jsx";

// import { ROLES } from "./utils/constants";

// function ProtectedRoute({ children, allowedRoles }) {
//   const { user, loading } = useAuth();

//   if (loading) return null; // Add spinner if needed

//   if (!user) return <Navigate to="/login" replace />;

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* Default → Login */}
//       <Route path="/" element={<Navigate to="/login" replace />} />

//       {/* Auth Routes */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       {/* Student Routes */}
//       <Route
//         path="/student"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
//             <StudentDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/student/complaints"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
//             <StudentComplaintsPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/complaints"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
//             <AdminComplaintsPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/hostels"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
//             <AdminHostelsPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/hostels/:hostelId/rooms"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
//             <AdminRoomsPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/allocations"
//         element={
//           <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
//             <AdminAllocationsPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Catch-all */}
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentComplaintsPage from "./pages/student/StudentComplaintsPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage.jsx";
import AdminHostelsPage from "./pages/admin/AdminHostelsPage.jsx";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage.jsx";
import AdminAllocationsPage from "./pages/admin/AdminAllocationsPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* STUDENT PAGES (NO PROTECTION) */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/complaints" element={<StudentComplaintsPage />} />

      {/* ADMIN PAGES (NO PROTECTION) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
      <Route path="/admin/hostels" element={<AdminHostelsPage />} />
      <Route
        path="/admin/hostels/:hostelId/rooms"
        element={<AdminRoomsPage />}
      />
      <Route path="/admin/allocations" element={<AdminAllocationsPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
