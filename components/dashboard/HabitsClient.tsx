"use client";

import { useState } from "react";
import { Plus, Trash2, Flame, CheckCircle2 } from "lucide-react";
import type { Habit } from "@/types";

interface Props {
  initialHabits: Habit[];
}

const HABIT_COLORS = ["#C8FF00", "#00C8FF", "#FF4D1A", "#A855F7", "#F59E0B", "#10B981"];

function HeatmapDots({ completionDates }: { completionDates: string[] }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="flex gap-0.5 mt-3">
      {days.map((day) => (
        <div
          key={day}
          className="flex-1 h-1.5 rounded-full"
          style={{
            background: completionDates?.includes(day)
              ? "var(--volt)"
              : "var(--bg-card-hover)",
            opacity: completionDates?.includes(day) ? 1 : 0.6,
          }}
          title={day}
        />
      ))}
    </div>
  );
}

export default function HabitsClient({ initialHabits }: Props) {
  const [habits, setHabits] = useState<(Habit & { completion_dates?: string[]; completions_30d?: number })[]>(initialHabits as (Habit & { completion_dates?: string[]; completions_30d?: number })[]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", frequency: "daily" as Habit["frequency"], color: "#C8FF00" });
  const [loading, setLoading] = useState(false);

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const habit = await res.json();
      setHabits([...habits, { ...habit, completed_today: false, completion_dates: [], completions_30d: 0 }]);
      setForm({ name: "", description: "", frequency: "daily", color: "#C8FF00" });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/habits/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today }),
    });
    const { completed } = await res.json();

    setHabits(habits.map((h) => {
      if (h.id !== id) return h;
      const dates = h.completion_dates || [];
      return {
        ...h,
        completed_today: completed,
        completion_dates: completed
          ? [...dates, today]
          : dates.filter((d: string) => d !== today),
        completions_30d: completed
          ? (Number(h.completions_30d) || 0) + 1
          : Math.max(0, (Number(h.completions_30d) || 0) - 1),
      };
    }));
  };

  const deleteHabit = async (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
  };

  const completedCount = habits.filter((h) => h.completed_today).length;

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Habits
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {completedCount}/{habits.length} done today
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} />
          New Habit
        </button>
      </div>

      {/* Progress ring summary */}
      {habits.length > 0 && (
        <div
          className="glass-card p-5 mb-6 flex items-center gap-4 animate-fade-up"
        >
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--bg-card-hover)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="var(--volt)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(completedCount / habits.length) * 163.4} 163.4`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: "var(--volt)", fontFamily: "'JetBrains Mono', monospace" }}>
                {habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0}%
              </span>
            </div>
          </div>
          <div>
            <p className="font-semibold">Today&apos;s progress</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {completedCount} of {habits.length} habits completed
            </p>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={createHabit} className="glass-card p-5 mb-6 animate-fade-up">
          <div className="space-y-3">
            <input
              autoFocus
              placeholder="Habit name..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            <div className="flex gap-3 items-center">
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value as Habit["frequency"] })}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <div className="flex gap-2 items-center">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Color:</span>
                {HABIT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      border: form.color === c ? "2px solid white" : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-4 py-2 rounded-xl text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading || !form.name.trim()} className="btn-primary px-4 py-2 rounded-xl text-sm">
                {loading ? "Adding..." : "Add Habit"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Habits grid */}
      {habits.length === 0 ? (
        <div className="text-center py-16">
          <p style={{ color: "var(--text-muted)" }}>No habits yet. Start building your routine.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="glass-card p-5 group relative transition-all duration-200"
              style={{
                borderColor: habit.completed_today
                  ? `${habit.color}40`
                  : "var(--border)",
                boxShadow: habit.completed_today ? `0 0 20px ${habit.color}15` : "none",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className="transition-transform hover:scale-110"
                  >
                    {habit.completed_today ? (
                      <CheckCircle2 size={22} style={{ color: habit.color }} />
                    ) : (
                      <div
                        className="w-[22px] h-[22px] rounded-full border-2"
                        style={{ borderColor: habit.color + "80" }}
                      />
                    )}
                  </button>
                  <div>
                    <p className="font-medium text-sm">{habit.name}</p>
                    {habit.description && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">
                  <Flame size={11} style={{ color: habit.color }} />
                  {habit.completions_30d || 0}/30 days
                </span>
                <span
                  className="px-2 py-0.5 rounded-full capitalize"
                  style={{ background: `${habit.color}15`, color: habit.color }}
                >
                  {habit.frequency}
                </span>
              </div>

              {/* 30-day heatmap */}
              <HeatmapDots completionDates={habit.completion_dates || []} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
