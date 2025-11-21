import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4">
      <div className="text-slate-300 text-sm">
        Welcome, <span className="font-semibold text-white">{user?.name}</span>
      </div>

      <button
        onClick={handleLogout}
        className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-200 hover:bg-slate-700"
      >
        Logout
      </button>
    </header>
  );
}
