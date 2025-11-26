import { NavLink } from "react-router-dom";
import { ROLES } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import { NotificationBadge } from "../common/StatusBadge";
import { DashboardIcon, ComplaintsIcon, HostelsIcon, AllocationsIcon, UserIcon } from "../common/Icons";

export default function Sidebar() {
  const { user } = useAuth();

  const studentLinks = [
    { 
      name: "Dashboard", 
      path: "/student", 
      icon: <DashboardIcon />,
      description: "Overview & Analytics"
    },
    { 
      name: "My Complaints", 
      path: "/student/complaints", 
      icon: <ComplaintsIcon />,
      description: "Issue Management",
      badge: 2
    },
  ];

  const adminLinks = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <DashboardIcon />,
      description: "System Overview"
    },
    { 
      name: "Complaints", 
      path: "/admin/complaints", 
      icon: <ComplaintsIcon />,
      description: "Issue Resolution",
      badge: 5
    },
    { 
      name: "Hostels", 
      path: "/admin/hostels", 
      icon: <HostelsIcon />,
      description: "Facility Management"
    },
    { 
      name: "Allocations", 
      path: "/admin/allocations", 
      icon: <AllocationsIcon />,
      description: "Room Assignments"
    },
  ];

  const links = user?.role === ROLES.ADMIN ? adminLinks : studentLinks;

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">HMS</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Hostel Management</h1>
            <p className="text-xs text-slate-400">Enterprise System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {link.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{link.name}</span>
                    {link.badge && <NotificationBadge count={link.badge} />}
                  </div>
                  <p className={`text-xs transition-colors ${
                    isActive ? 'text-indigo-100' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {link.description}
                  </p>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {user?.role?.toLowerCase() || 'Student'} Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}