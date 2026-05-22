"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Repeat2,
  Target,
  StickyNote,
  Timer,
  Package,
  Zap,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/habits", label: "Habits", icon: Repeat2 },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/notes", label: "Notes", icon: StickyNote },
  { href: "/dashboard/pomodoro", label: "Focus", icon: Timer },
  { href: "/dashboard/deliveries", label: "Deliveries", icon: Package },
];

const NavContent = ({ pathname, setMobileOpen }: { pathname: string; setMobileOpen: (v: boolean) => void }) => (
  <div className="flex flex-col h-full">
    <div className="px-6 py-6 mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--volt)" }}>
          <Zap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}>
          Momentum
        </span>
      </div>
    </div>

    <nav className="flex-1 px-3">
      <div className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                background: isActive ? "rgba(200, 125, 135, 0.1)" : "transparent",
                color: isActive ? "var(--volt)" : "var(--text-secondary)",
                borderLeft: isActive ? "2px solid var(--volt)" : "2px solid transparent",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>

    <div className="px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Powered by Neon + Vercel</p>
    </div>
  </div>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-30" style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
        <NavContent pathname={pathname} setMobileOpen={setMobileOpen} />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--volt)" }}>
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Momentum</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg" style={{ color: "var(--text-secondary)" }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-40 flex flex-col" style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
            <div className="h-14" />
            <NavContent pathname={pathname} setMobileOpen={setMobileOpen} />
          </aside>
        </>
      )}
    </>
  );
}
