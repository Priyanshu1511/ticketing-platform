"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Ticket {
  ticketId: string;
  name: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function DashboardClient() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const newTicketId = searchParams.get("new");

  useEffect(() => {
    fetch("/api/ticket")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Failed to load tickets");
          setLoading(false);
          return;
        }

        if (newTicketId) {
          const exists = data.some(
            (t: Ticket) => t.ticketId === newTicketId
          );

          if (!exists) {
            data.unshift({
              ticketId: newTicketId,
              name: "You",
              category: "New",
              status: "OPEN",
              createdAt: new Date().toISOString(),
            });
          }
        }

        setTickets(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to server");
        setLoading(false);
      });
  }, [newTicketId]);

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📊 Ticket Dashboard</h1>
          <p className="text-sm text-white/60 mt-1">
            All support tickets raised via Bhuneer Support
          </p>
        </div>

        <a href="/" className="text-sm underline text-white/70 hover:text-white">
          ← Back to Create Ticket
        </a>
      </div>

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
            {tickets.map((t) => {
              const isNew = t.ticketId === newTicketId;

              return (
                <tr
                  key={t.ticketId}
                  className={`border-t border-white/10 transition ${
                    isNew ? "bg-green-500/20 animate-pulse" : "hover:bg-white/10"
                  }`}
                >
                  <td className="p-3 font-mono text-xs text-blue-300">
                    {t.ticketId}
                  </td>
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3 text-xs text-white/60">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
