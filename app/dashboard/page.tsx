"use client";
import { useEffect, useState } from "react";

interface Ticket {
  ticketId: string;
  name: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ticket") // ✅ FIXED (singular)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          setError("Failed to load tickets");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to server");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-pulse text-lg">Loading tickets…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📊 Ticket Dashboard</h1>
          <p className="text-sm text-white/60 mt-1">
            All support tickets raised via Bhuneer Support
          </p>
        </div>

        <a
          href="/"
          className="text-sm underline text-white/70 hover:text-white"
        >
          ← Back to Create Ticket
        </a>
      </div>

      {/* Empty State */}
      {tickets.length === 0 ? (
        <div className="text-center text-white/60 mt-20">
          No tickets found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/20 bg-white/5 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Ticket ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t.ticketId}
                  className="border-t border-white/10 hover:bg-white/10 transition"
                >
                  <td className="p-3 font-mono text-xs text-blue-300">
                    {t.ticketId}
                  </td>

                  <td className="p-3">{t.name}</td>

                  <td className="p-3">{t.category}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          t.status === "OPEN"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="p-3 text-xs text-white/60">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-white/40">
        Bhuneer Support Dashboard • Powered by Next.js
      </p>
    </div>
  );
}
