"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Target, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";

interface Goal {
  id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  status: "active" | "completed" | "paused";
  color: string;
  created_at: string;
  updated_at: string;
}

const GOAL_COLORS = ["#00C8FF", "#C87D87", "#FF4D1A", "#A855F7", "#F59E0B", "#6B7556"];

function launchPetalConfetti() {
  const colors = ["#FFD6E0", "#F0A0B0", "#FBEAD6", "#C87D87", "#E5BCA9", "#F4C0D1"];
  for (let i = 0; i < 40; i++) {
    const petal = document.createElement("div");
    petal.className = "confetti-petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.top = "-20px";
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    petal.style.animationDelay = Math.random() * 1.5 + "s";
    petal.style.animationDuration = (2 + Math.random() * 2) + "s";
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 4000);
  }
}

export default function GoalsClient({ initialGoals }: { initialGoals: any[] }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals as Goal[]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", target_value: 100, current_value: 0,
    unit: "%", deadline: "", color: "#C87D87",
  });
  const [loading, setLoading] = useState(false);

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const goal = await res.json();
      setGoals([goal, ...goals]);
      setForm({ title: "", description: "", target_value: 100, current_value: 0, unit: "%", deadline: "", color: "#C87D87" });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (id: string) => {
    const val = parseFloat(editValue);
    if (isNaN(val)) return;
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const completed = val >= goal.target_value;
    const res = await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_value: val, status: completed ? "completed" : "active" }),
    });
    const updated = await res.json();
    setGoals(goals.map((g) => (g.id === id ? updated : g)));
    setEditingId(null);
    if (completed) launchPetalConfetti();
  };

  const deleteGoal = async (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
    const isEditing = editingId === goal.id;

    return (
      <div className="glass-card p-5 group relative" style={{ borderColor: goal.status === "completed" ? `${goal.color}40` : "var(--border)" }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${goal.color}18` }}>
              <Target size={18} style={{ color: goal.color }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{goal.title}</p>
              {goal.description && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{goal.description}</p>}
            </div>
          </div>
          <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
            <Trash2 size={13} />
          </button>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{goal.current_value} / {goal.target_value} {goal.unit}</span>
            <span className="text-sm font-bold" style={{ color: goal.color, fontFamily: "'JetBrains Mono', monospace" }}>{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: goal.color }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                autoFocus type="number" value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") updateProgress(goal.id); if (e.key === "Escape") setEditingId(null); }}
                className="flex-1 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                placeholder={`Current value (${goal.unit})`}
              />
              <button onClick={() => updateProgress(goal.id)} className="p-1.5 rounded-lg" style={{ background: `${goal.color}20`, color: goal.color }}><Check size={14} /></button>
              <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}><X size={14} /></button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setEditingId(goal.id); setEditValue(String(goal.current_value)); }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ background: "var(--bg-card-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                <Edit2 size={11} /> Update progress
              </button>
              {goal.deadline && <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>Due {format(new Date(goal.deadline), "MMM d")}</span>}
            </>
          )}
        </div>

        {goal.status === "completed" && (
          <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${goal.color}20`, color: goal.color }}>✓ Done</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Goals</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{activeGoals.length} active · {completedGoals.length} completed</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={createGoal} className="glass-card p-5 mb-6 animate-fade-up">
          <div className="space-y-3">
            <input autoFocus placeholder="Goal title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            <div className="grid grid-cols-3 gap-3">
              <input type="number" placeholder="Target" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: Number(e.target.value) })} className="px-3 py-2.5 rounded-xl text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <input type="number" placeholder="Current" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: Number(e.target.value) })} className="px-3 py-2.5 rounded-xl text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <input placeholder="Unit (%, kg, km)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="px-3 py-2.5 rounded-xl text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div className="flex gap-3 items-center">
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="flex-1 px-3 py-2.5 rounded-xl text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <div className="flex gap-2">
                {GOAL_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className="w-6 h-6 rounded-full transition-transform hover:scale-110" style={{ background: c, border: form.color === c ? "2px solid #2C1810" : "2px solid transparent" }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button type="submit" disabled={loading || !form.title.trim()} className="btn-primary px-4 py-2 rounded-xl text-sm">{loading ? "Creating..." : "Create Goal"}</button>
            </div>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-16"><p style={{ color: "var(--text-muted)" }}>No goals yet. What do you want to achieve?</p></div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Active</h2>
              <div className="grid sm:grid-cols-2 gap-4">{activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div>
            </div>
          )}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Completed</h2>
              <div className="grid sm:grid-cols-2 gap-4 opacity-60">{completedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
