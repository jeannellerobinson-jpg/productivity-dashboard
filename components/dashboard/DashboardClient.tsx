"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default function DashboardClient({ data, today }: any) {
  const { stats, tasks, habits, goals } = data;
  const completionRate = stats.tasks_total > 0 ? Math.round((Number(stats.tasks_completed) / Number(stats.tasks_total)) * 100) : 0;
  const habitRate = stats.habits_total > 0 ? Math.round((Number(stats.habits_today) / Number(stats.habits_total)) * 100) : 0;

  const statCards = [
    { label: "Tasks done",     value: `${stats.tasks_completed}/${stats.tasks_total}`, sub: `${completionRate}% complete`, color: "#FF3CAC", emoji: "✅", href: "/dashboard/tasks" },
    { label: "Habits today",   value: `${stats.habits_today}/${stats.habits_total}`,  sub: `${habitRate}% complete`,     color: "#FFD700", emoji: "🔁", href: "/dashboard/habits" },
    { label: "Active goals",   value: stats.goals_active,                              sub: "In progress",                 color: "#7B9E6B", emoji: "🎯", href: "/dashboard/goals" },
    { label: "Focus sessions", value: stats.pomodoros_today,                           sub: "Today",                       color: "#FF8DE0", emoji: "⏱️", href: "/dashboard/pomodoro" },
  ];

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px" }}>{today}</p>
        <h1 className="page-title" style={{ fontSize: "36px", lineHeight: 1.2 }}>Good day, Queen 👑</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px", fontSize: "14px" }}>Here&apos;s your world at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Link key={stat.label} href={stat.href}
            className="glass-card p-5 block animate-fade-up"
            style={{ animationDelay: `${i * 0.06}s`, borderColor: `${stat.color}25` }}>
            <div className="flex items-start justify-between mb-3">
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
              <span style={{ fontSize: "18px" }}>{stat.emoji}</span>
            </div>
            <p style={{ fontSize: "28px", fontFamily: "'Playfair Display', serif", fontWeight: 800, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 animate-fade-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "18px" }}>Recent Tasks</h2>
            <Link href="/dashboard/tasks" style={{ color: "var(--text-muted)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "2rem 0" }}>
              No tasks yet. <Link href="/dashboard/tasks" style={{ color: "var(--volt)" }}>Add one →</Link>
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task: any) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ background: "var(--bg-card-hover)", opacity: task.completed ? 0.5 : 1 }}>
                  <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: task.completed ? "var(--volt)" : "var(--text-muted)", background: task.completed ? "var(--volt)" : "transparent" }}>
                    {task.completed && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ fontSize: "13px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "var(--text-muted)" : "var(--text-primary)" }}>
                    {task.title}
                  </span>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                    background: task.priority === "high" ? "rgba(255,60,172,0.15)" : task.priority === "medium" ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)",
                    color: task.priority === "high" ? "#FF3CAC" : task.priority === "medium" ? "#FFD700" : "var(--text-muted)",
                  }}>{task.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="glass-card p-5 animate-fade-up delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "16px" }}>Habits 🔁</h2>
              <Link href="/dashboard/habits" style={{ color: "var(--text-muted)" }}><ArrowRight size={14} /></Link>
            </div>
            {habits.length === 0 ? (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                <Link href="/dashboard/habits" style={{ color: "var(--volt)" }}>Start tracking →</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {habits.slice(0, 4).map((habit: any) => (
                  <div key={habit.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: habit.completed_today ? "var(--volt)" : "var(--text-muted)", boxShadow: habit.completed_today ? "0 0 6px var(--volt)" : "none" }} />
                    <span style={{ fontSize: "13px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: habit.completed_today ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {habit.name}
                    </span>
                    {habit.streak && Number(habit.streak) > 1 && (
                      <span style={{ fontSize: "11px", color: "#FFD700", display: "flex", alignItems: "center", gap: "2px" }}>
                        <Flame size={10} />{habit.streak}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-5 animate-fade-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "16px" }}>Goals 🎯</h2>
              <Link href="/dashboard/goals" style={{ color: "var(--text-muted)" }}><ArrowRight size={14} /></Link>
            </div>
            {goals.length === 0 ? (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                <Link href="/dashboard/goals" style={{ color: "var(--volt)" }}>Set a goal →</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal: any) => {
                  const progress = Math.min(100, Math.round((Number(goal.current_value) / Number(goal.target_value)) * 100));
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>{goal.title}</span>
                        <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: goal.color }}>{progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${progress}%`, background: `linear-gradient(90deg, var(--volt), ${goal.color})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
