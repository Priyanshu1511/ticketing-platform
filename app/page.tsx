"use client";
import { useEffect, useState } from "react";

interface TicketForm {
  name: string;
  email: string;
  category: string;
  description: string;
}

export default function Home() {
  const [form, setForm] = useState<TicketForm>({
    name: "",
    email: "",
    category: "Network",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // 🌗 THEME STATE
  const [darkMode, setDarkMode] = useState(true);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDarkMode(false);
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function submitTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.ticketId) {
      setSuccess(data.ticketId);
      setForm({
        name: "",
        email: "",
        category: "Network",
        description: "",
      });
    }
  }

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center px-4 transition-colors
        ${
          darkMode
            ? "bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"
            : "bg-gradient-to-br from-slate-100 to-slate-200"
        }`}
    >
      {/* Background Glow (dark only) */}
      {darkMode && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
      )}

      {/* Card */}
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl p-8 backdrop-blur-xl transition-colors
          ${
            darkMode
              ? "bg-white/10 border border-white/20 text-white"
              : "bg-white border border-slate-200 text-slate-800"
          }`}
      >
        {/* 🌗 THEME TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 text-sm px-3 py-1 rounded-full border transition
            dark:border-white/20 border-slate-300"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            🚀 Bhuneer Support
          </h1>
          <p className={`text-sm mt-2 ${darkMode ? "text-white/70" : "text-slate-500"}`}>
            Create a support ticket and track it in real time
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-500/20 border border-green-400/30 p-5 text-sm text-center">
            <h2 className="text-lg font-semibold mb-2">
              🎉 Ticket Created Successfully
            </h2>
            <p className="mb-2">Your ticket number:</p>
            <div className="font-mono text-xl tracking-wider">
              {success}
            </div>
            <button
              className="mt-4 text-xs underline"
              onClick={() => setSuccess(null)}
            >
              Create another ticket
            </button>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={submitTicket} className="space-y-5">
            {[
              { label: "Full Name", type: "text", key: "name" },
              { label: "Email", type: "email", key: "email" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs uppercase tracking-wide">
                  {f.label}
                </label>
                <input
                  required
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  className={`mt-1 w-full rounded-lg px-4 py-2 text-sm border focus:outline-none
                    ${
                      darkMode
                        ? "bg-white/10 border-white/20 focus:ring-2 focus:ring-blue-500"
                        : "bg-white border-slate-300 focus:ring-2 focus:ring-blue-400"
                    }`}
                />
              </div>
            ))}

            <div>
              <label className="text-xs uppercase tracking-wide">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className={`mt-1 w-full rounded-lg px-4 py-2 text-sm border
                  ${
                    darkMode
                      ? "bg-white/10 border-white/20"
                      : "bg-white border-slate-300"
                  }`}
              >
                <option>Network</option>
                <option>Server</option>
                <option>Application</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide">
                Issue Description
              </label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`mt-1 w-full rounded-lg px-4 py-2 text-sm border
                  ${
                    darkMode
                      ? "bg-white/10 border-white/20"
                      : "bg-white border-slate-300"
                  }`}
              />
            </div>

            <button
              disabled={loading}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition
                ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Creating Ticket…" : "Create Ticket"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-xs opacity-70">
          <a href="/dashboard" className="underline">
            View Ticket Dashboard →
          </a>
        </p>
      </div>
    </div>
  );
}
