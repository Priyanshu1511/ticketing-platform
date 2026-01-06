"use client";
import { useState } from "react";

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
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      {/* Card */}
      <div className="relative w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            🚀 Bhuneer Support
          </h1>
          <p className="text-sm text-white/70 mt-2">
            Create a support ticket and track it in real time
          </p>
        </div>

        {/* Success Acknowledgement */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-500/20 border border-green-400/30 p-5 text-sm text-center">
            <h2 className="text-lg font-semibold mb-2">
              🎉 Ticket Created Successfully
            </h2>

            <p className="text-white/80 mb-2">
              Please note your ticket number for future reference:
            </p>

            <div className="font-mono text-xl text-green-200 tracking-wider">
              {success}
            </div>

            <button
              className="mt-4 text-xs underline text-white/70 hover:text-white"
              onClick={() => setSuccess(null)}
            >
              Create another ticket
            </button>
          </div>
        )}

        {/* Ticket Form */}
        {!success && (
          <form onSubmit={submitTicket} className="space-y-5">
            
            <div>
              <label className="text-xs uppercase tracking-wide text-white/70">
                Full Name
              </label>
              <input
                value={form.name}
                required
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Priyanshu Sharma"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-white/70">
                Email
              </label>
              <input
                value={form.email}
                type="email"
                required
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@company.com"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-white/70">
                Category
              </label>
              <select
                value={form.category}
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option className="text-black">Network</option>
                <option className="text-black">Server</option>
                <option className="text-black">Application</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-white/70">
                Issue Description
              </label>
              <textarea
                value={form.description}
                required
                rows={4}
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain the issue clearly…"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition-all
                ${
                  loading
                    ? "bg-white/30 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
                }`}
            >
              {loading ? "Creating Ticket…" : "Create Ticket"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/50">
          <a href="/dashboard" className="underline hover:text-white">
            View Ticket Dashboard →
          </a>
        </p>

        <p className="mt-2 text-center text-[10px] text-white/40">
          Powered by Bhuneer • Built with Next.js
        </p>
      </div>
    </div>
  );
}
