"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Package, RefreshCw } from "lucide-react";

export default function DeliveriesPage() {
  const { data: session, status } = useSession();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/deliveries");
      const data = await res.json();
      if (Array.isArray(data)) setDeliveries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchDeliveries();
  }, [session]);

  if (status === "loading") return <div className="p-8 pt-20 lg:pt-8" style={{ color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Deliveries</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Tracking from your Gmail</p>
        </div>
        {session && (
          <button onClick={fetchDeliveries} className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      {!session ? (
        <div className="glass-card p-12 text-center">
          <Package size={40} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <h2 className="text-xl font-semibold mb-2">Connect your Gmail</h2>
          <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>Sign in with Google to track your deliveries automatically</p>
          <button onClick={() => signIn("google")} className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold">
            Connect Gmail
          </button>
        </div>
      ) : loading ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>Scanning your emails...</div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>No delivery emails found</div>
      ) : (
        <div className="space-y-3">
          {deliveries.map((d) => (
            <div key={d.id} className="glass-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${d.color}18` }}>
                <Package size={18} style={{ color: d.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{d.subject}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{d.from}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${d.color}18`, color: d.color }}>{d.status}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{d.carrier}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
