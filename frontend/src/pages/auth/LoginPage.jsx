import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin, loginStudent } from "../../services/authService";
import { ROLES } from "../../utils/constants";

export default function LoginPage() {
  const [role, setRole] = useState(ROLES.STUDENT);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { email, password };
      const data =
        role === ROLES.ADMIN
          ? await loginAdmin(payload)
          : await loginStudent(payload);

      // expecting { token, user: { id, name, role } }
      login(data.user, data.token);

      navigate(role === ROLES.ADMIN ? "/admin" : "/student");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-slate-950/70 p-7">
        <h1 className="text-2xl font-semibold text-slate-50 text-center mb-1">
          Welcome back
        </h1>
        <p className="text-xs text-slate-400 text-center mb-6">
          Smart Hostel Allocation & Complaint SLA Dashboard
        </p>

        <div className="flex mb-5 bg-slate-900/80 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setRole(ROLES.STUDENT)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
              role === ROLES.STUDENT
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/40"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole(ROLES.ADMIN)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
              role === ROLES.ADMIN
                ? "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/40"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 placeholder:text-slate-500"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          For demo, use seeded student/admin accounts.
        </p>
      </div>
    </div>
  );
}
