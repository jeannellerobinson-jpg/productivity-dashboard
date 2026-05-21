import Sidebar from "@/components/Sidebar";
import { SessionProvider } from "@/components/SessionProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-64">{children}</main>
      </div>
    </SessionProvider>
  );
}
