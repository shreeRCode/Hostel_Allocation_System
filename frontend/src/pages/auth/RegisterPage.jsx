import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent } from "../../services/authService";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    preference: "",
    branch: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerStudent(form);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950/90 p-7 shadow-2xl shadow-slate-950/70">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <h1 className="text-2xl font-semibold text-slate-50 text-center mb-1">
          Student Registration
        </h1>
        <p className="text-xs text-slate-400 text-center mb-6">
          Enter your academic details so the system can allocate the best hostel
          and room for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name - Full Width */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Email - Full Width */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Password - Full Width */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Gender and Preference - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Hostel Preference
              </label>
              <select
                name="preference"
                value={form.preference}
                onChange={handleChange}
                required
                disabled={!form.gender}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
              >
                <option value="">Select Hostel</option>
                {form.gender === 'MALE' && (
                  <>
                    <option value="Beta">Beta (Boys)</option>
                    <option value="Gamma">Gamma (Co-ed)</option>
                  </>
                )}
                {form.gender === 'FEMALE' && (
                  <>
                    <option value="Alpha">Alpha (Girls)</option>
                    <option value="Gamma">Gamma (Co-ed)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Department and Year - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Department
              </label>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="">Select Department</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Computer & Communication Engineering">Computer & Communication Engineering</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Computer Science & Engineering(Cyber Security)">Computer Science & Engineering(Cyber Security)</option>
                <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                <option value="Electronics Engineering (VLSI Design & Technology)">Electronics Engineering (VLSI Design & Technology)</option>
                <option value="Electronics & Communication (Advanced Communication Technology)">Electronics & Communication (Advanced Communication Technology)</option>
                <option value="Information Science & Engineering">Information Science & Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Robotics & Artificial Intelligence">Robotics & Artificial Intelligence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Year
              </label>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <Link
            to="/"
            className="font-medium text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            ← Home
          </Link>
          <span>
            Already registered?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
