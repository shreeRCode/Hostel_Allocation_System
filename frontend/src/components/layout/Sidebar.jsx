import { NavLink } from "react-router-dom";
import { ROLES } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const studentLinks = [
    { name: "Dashboard", path: "/student" },
    { name: "My Complaints", path: "/student/complaints" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Complaints", path: "/admin/complaints" },
    { name: "Hostels", path: "/admin/hostels" },
    { name: "Allocations", path: "/admin/allocations" },
  ];

  const links = user?.role === ROLES.ADMIN ? adminLinks : studentLinks;

  return (
    <aside className="w-56 h-screen bg-slate-950 border-r border-slate-800 flex flex-col p-4">
      <div className="text-xl font-semibold text-white mb-6">Hostel System</div>

      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 text-sm rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-xs text-slate-500">
        Logged in as: {user?.name}
      </div>
    </aside>
  );
}
