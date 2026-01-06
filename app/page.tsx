"use client";
import { useEffect, useState } from "react";

/* ===============================
   TYPES
================================ */
interface TicketForm {
  name: string;
  email: string;
  category: string;
  description: string;
}

/* ===============================
   SLOW AI TYPING (HUMAN-LIKE)
================================ */
function useSlowTyping(text: string, speed = 120) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplay((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return display;
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
  const [darkMode, setDarkMode] = useState(true);

  /* ---------------- THEME ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDarkMode(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ---------------- AI TEXT ---------------- */
  const aiTitle = useSlowTyping(
    "BHUNEER AI SUPPORT SYSTEM",
    110 // 👈 slower, realistic
  );

  /* ---------------- SUBMIT ---------------- */
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
      className={`min-h-screen relative flex items-center justify-center px-6
        ${darkMode ? "bg-black text-white" : "bg-slate-100 text-slate-900"}`}
    >
      {/* AI GRID */}
      {darkMode && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      )}

      {/* CARD */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl p-[1px] bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600">
        <div
          className={`rounded-3xl p-8 backdrop-blur-xl
            ${darkMode ? "bg-black/80 border border-white/10" : "bg-white border border-slate-200"}`}
        >
          {/* THEME TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10"
          >
            {darkMode ? "☀ LIGHT" : "🌙 DARK"}
          </button>

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-mono font-bold tracking-widest bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {aiTitle}
              <span className="ml-1 animate-pulse">▌</span>
            </h1>
            <p
              className={`mt-3 text-xs tracking-[0.35em] uppercase
                ${darkMode ? "text-white/60" : "text-slate-500"}`}
            >
              Autonomous Issue Intelligence System
            </p>
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="mb-8 rounded-2xl border border-green-400/30 bg-green-500/10 p-6 text-center">
              <p className="text-green-400 tracking-widest text-sm mb-2">
                ✔ REQUEST ACCEPTED
              </p>
              <div className="font-mono text-2xl tracking-widest text-green-400">
                {success}
              </div>
              <button
                className="mt-5 text-xs underline opacity-70 hover:opacity-100"
                onClick={() => setSuccess(null)}
              >
                CREATE NEW REQUEST
              </button>
            </div>
          )}

          {/* FULL FORM */}
          {!success && (
            <form onSubmit={submitTicket} className="space-y-6">
              {/* NAME */}
              <div>
                <label className="block text-[10px] tracking-[0.35em] mb-2">
                  OPERATOR NAME
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={`w-full rounded-xl px-4 py-3 text-sm border
                    ${
                      darkMode
                        ? "bg-black/60 border-cyan-500/30 text-white focus:ring-2 focus:ring-cyan-400/60"
                        : "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-400"
                    }`}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-[10px] tracking-[0.35em] mb-2">
                  COMMUNICATION EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className={`w-full rounded-xl px-4 py-3 text-sm border
                    ${
                      darkMode
                        ? "bg-black/60 border-cyan-500/30 text-white focus:ring-2 focus:ring-cyan-400/60"
                        : "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-400"
                    }`}
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-[10px] tracking-[0.35em] mb-2">
                  INCIDENT CATEGORY
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={`w-full rounded-xl px-4 py-3 text-sm border
                    ${
                      darkMode
                        ? "bg-black/60 border-cyan-500/30 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                >
                  <option>Network</option>
                  <option>Server</option>
                  <option>Application</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-[10px] tracking-[0.35em] mb-2">
                  INCIDENT DESCRIPTION
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`w-full rounded-xl px-4 py-3 text-sm border
                    ${
                      darkMode
                        ? "bg-black/60 border-cyan-500/30 text-white focus:ring-2 focus:ring-cyan-400/60"
                        : "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-400"
                    }`}
                />
              </div>

              {/* SUBMIT */}
              <button
                disabled={loading}
                className={`w-full py-4 rounded-xl text-sm font-bold tracking-widest transition
                  ${
                    loading
                      ? "bg-slate-500 cursor-not-allowed"
                      : darkMode
                        ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:scale-[1.03]"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
              >
                {loading ? "PROCESSING…" : "SUBMIT TO AI CORE"}
              </button>
            </form>
            
          )}
          {/* DASHBOARD LINK */}
<p
  className={`mt-8 text-center text-[10px] tracking-[0.35em] uppercase
    ${darkMode ? "text-white/50" : "text-slate-500"}`}
>
  <a
    href="/dashboard"
    className={`transition hover:underline
      ${darkMode ? "hover:text-cyan-400" : "hover:text-slate-900"}`}
  >
    ACCESS COMMAND DASHBOARD →
  </a>
</p>

        </div>
      </div>
    </div>
  );
}
