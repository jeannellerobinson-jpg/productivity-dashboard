import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">{children}</main>
    </div>
  );
}
