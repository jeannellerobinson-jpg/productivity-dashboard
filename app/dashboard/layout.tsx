import Sidebar from "@/components/Sidebar";
import { SessionProvider } from "@/components/SessionProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <div className="petals-container">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="petal" />
          ))}
        </div>
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-64 relative z-10">{children}</main>
      </div>
    </SessionProvider>
  );
}
