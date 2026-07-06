import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HostelsIcon,
  ComplaintsIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  CheckIcon,
} from "../components/common/Icons";

const HomePage = () => {
  const navigate = useNavigate();
  const [counters, setCounters] = useState({ hostels: 0, rooms: 0, students: 0 });

  useEffect(() => {
    const animateCounters = () => {
      // Real figures, matching the seed data (Alpha 30 + Beta 40 + Gamma 50 rooms).
      const targets = { hostels: 3, rooms: 120, students: 300 };
      const duration = 1400;
      const steps = 40;
      const stepTime = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounters({
          hostels: Math.floor(targets.hostels * progress),
          rooms: Math.floor(targets.rooms * progress),
          students: Math.floor(targets.students * progress),
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });

    const statsSection = document.getElementById("stats-section");
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Smart Room Allocation",
      description:
        "Students are automatically matched to a room based on gender, hostel preference, and live availability — with a fallback hostel if their first choice is full.",
      icon: <HostelsIcon className="w-7 h-7" />,
    },
    {
      title: "Complaint Tracking",
      description:
        "Raise maintenance issues — electrical, plumbing, network, and more — and track every complaint from submission to resolution.",
      icon: <ComplaintsIcon className="w-7 h-7" />,
    },
    {
      title: "SLA-Based Escalation",
      description:
        "Every issue category has a resolution deadline. If it's missed, the complaint is automatically escalated so it doesn't get forgotten.",
      icon: <ClockIcon className="w-7 h-7" />,
    },
  ];

  const steps = [
    {
      title: "Register",
      description: "Sign up with your branch, year, gender, and preferred hostel.",
    },
    {
      title: "Get Allocated",
      description: "Our system automatically assigns you a room the moment space is available.",
    },
    {
      title: "Raise & Track Complaints",
      description: "Report issues in seconds and follow their status until they're resolved.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                HostelHub
              </span>
            </div>

            <nav className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                Register
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fadeIn">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wide mb-6">
                For Students &amp; Hostel Administrators
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1]">
                <span className="text-white">Hostel life,</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  organized automatically
                </span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                No more manual room assignments or lost complaint slips. Register once —
                get automatically allocated a room, and raise issues that are
                tracked and escalated if they're not resolved in time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="group px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold text-base transition-all duration-300 shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  Register Now
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-3.5 border border-slate-700 hover:border-indigo-500/50 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-slate-800/50"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Decorative preview card instead of a stock photo */}
            <div className="animate-slideIn">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-semibold text-slate-300">Your Allocation</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium border border-emerald-500/25">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-xs text-slate-400 mb-1">Hostel</p>
                      <p className="text-lg font-semibold text-white">Alpha</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Room</p>
                      <p className="text-lg font-semibold text-white">204</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      "Allocated within seconds of registering",
                      "Gender & preference matched automatically",
                      "SLA-tracked complaint resolution",
                    ].map((line) => (
                      <div key={line} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-indigo-400 mb-1">{counters.hostels}</div>
              <div className="text-slate-400 text-sm">Hostels Managed</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-purple-400 mb-1">{counters.rooms}+</div>
              <div className="text-slate-400 text-sm">Rooms Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-pink-400 mb-1">{counters.students}+</div>
              <div className="text-slate-400 text-sm">Students Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Everything hostel management needs
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Built around the two things that actually matter: getting students into
              rooms, and getting their issues resolved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm p-7 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 mb-5 group-hover:text-indigo-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">How it works</h2>
            <p className="text-lg text-slate-400">Three steps from sign-up to a resolved complaint.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg font-bold mb-4 shadow-lg shadow-indigo-500/25">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Ready to get started?</h2>
          <p className="text-lg text-slate-400 mb-8">
            Register in a couple of minutes and let the system handle the rest.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-indigo-500/25 inline-flex items-center gap-2"
          >
            <UserIcon className="w-5 h-5" />
            Create your account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                HostelHub
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <button onClick={() => navigate("/login")} className="hover:text-white transition-colors">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="hover:text-white transition-colors">
                Register
              </button>
            </div>

            <p className="text-sm text-slate-500">© 2026 HostelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
