"use client";

import Link from "next/link";
import { CheckSquare, Repeat2, Target, Timer, ArrowRight, Flame } from "lucide-react";

interface Props {
  data: {
    tasks: Record<string, unknown>[];
    habits: Record<string, unknown>[];
    goals: Record<string, unknown>[];
    notes: Record<string, unknown>[];
    stats: {
      tasks_total: number;
      tasks_completed: number;
      habits_total: number;
      habits_today: number;
      goals_active: number;
      pomodoros_today: number;
    };
  };
  today: string;
}

export default function DashboardClient({ data, today }: Props) {
  const { stats, tasks, habits, goals } = data;
  const completionRate =
    stats.tasks_total > 0
      ? Math.round((Number(stats.tasks_completed) / Number(stats.tasks_total)) * 100)
      : 0;

  const habitRate =
    stats.habits_total > 0
      ? Math.round((Number(stats.habits_today) / Number(stats.habits_total)) * 100)
      : 0;

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          {today}
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
          Good day 👋
        </h1>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
          Here&apos;s your productivity snapshot
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Tasks done",
            value: `${stats.tasks_completed}/${stats.tasks_total}`,
            sub: `${completionRate}% complete`,
            color: "var(--volt)",
            icon: CheckSquare,
            href: "/dashboard/tasks",
          },
          {
            label: "Habits today",
            value: `${stats.habits_today}/${stats.habits_total}`,
            sub: `${habitRate}% complete`,
            color: "#00C8FF",
            icon: Repeat2,
            href: "/dashboard/habits",
          },
          {
            label: "Active goals",
            value: stats.goals_active,
            sub: "In progress",
            color: "#FF4D1A",
            icon: Target,
            href: "/dashboard/goals",
          },
          {
            label: "Focus sessions",
            value: stats.pomodoros_today,
            sub: "Today",
            color: "#A855F7",
            icon: Timer,
            href: "/dashboard/pomodoro",
          },
        ].map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-card p-5 hover:scale-[1.02] transition-all duration-200 animate-fade-up block"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
              <stat.icon size={16} style={{ color: stat.color }} strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {stat.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent tasks */}
        <div className="lg:col-span-2 glass-card p-6 animate-fade-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
              Recent Tasks
            </h2>
            <Link
              href="/dashboard/tasks"
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: "var(--text-muted)" }} className="text-sm">
                No tasks yet.{" "}
                <Link href="/dashboard/tasks" style={{ color: "var(--volt)" }}>
                  Add one →
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task: Record<string, unknown>) => (
                <div
                  key={task.id as string}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{
                    background: "var(--bg-card-hover)",
                    opacity: task.completed ? 0.5 : 1,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: task.completed ? "var(--volt)" : "var(--text-muted)",
                      background: task.completed ? "var(--volt)" : "transparent",
                    }}
                  >
                    {task.completed && (
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm flex-1 truncate"
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
                    }}
                  >
                    {task.title as string}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        task.priority === "high"
                          ? "rgba(255, 77, 26, 0.15)"
                          : task.priority === "medium"
                          ? "rgba(200, 255, 0, 0.1)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        task.priority === "high"
                          ? "#FF4D1A"
                          : task.priority === "medium"
                          ? "var(--volt)"
                          : "var(--text-muted)",
                    }}
                  >
                    {task.priority as string}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Habits today */}
          <div className="glass-card p-6 animate-fade-up delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
                Habits
              </h2>
              <Link href="/dashboard/habits" style={{ color: "var(--text-secondary)" }}>
                <ArrowRight size={16} />
              </Link>
            </div>

            {habits.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
                <Link href="/dashboard/habits" style={{ color: "var(--volt)" }}>Start tracking →</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {habits.slice(0, 4).map((habit: Record<string, unknown>) => (
                  <div key={habit.id as string} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: habit.completed_today ? (habit.color as string) : "var(--text-muted)" }}
                    />
                    <span
                      className="text-sm flex-1 truncate"
                      style={{ color: habit.completed_today ? "var(--text-primary)" : "var(--text-secondary)" }}
                    >
                      {habit.name as string}
                    </span>
                    {habit.streak && Number(habit.streak) > 1 && (
                      <span className="text-xs flex items-center gap-0.5" style={{ color: "#FF4D1A" }}>
                        <Flame size={10} />
                        {habit.streak as number}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goals progress */}
          <div className="glass-card p-6 animate-fade-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
                Goals
              </h2>
              <Link href="/dashboard/goals" style={{ color: "var(--text-secondary)" }}>
                <ArrowRight size={16} />
              </Link>
            </div>

            {goals.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
                <Link href="/dashboard/goals" style={{ color: "var(--volt)" }}>Set a goal →</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal: Record<string, unknown>) => {
                  const progress = Math.min(
                    100,
                    Math.round((Number(goal.current_value) / Number(goal.target_value)) * 100)
                  );
                  return (
                    <div key={goal.id as string}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs truncate max-w-[140px]" style={{ color: "var(--text-secondary)" }}>
                          {goal.title as string}
                        </span>
                        <span className="text-xs font-mono" style={{ color: goal.color as string }}>
                          {progress}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--bg-card-hover)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${progress}%`,
                            background: goal.color as string,
                          }}
                        />
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
