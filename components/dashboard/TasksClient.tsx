"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Filter, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/types";

interface Props {
  initialTasks: Task[];
}

const PRIORITY_COLORS = {
  high: { bg: "rgba(255,77,26,0.12)", text: "#FF4D1A", border: "rgba(255,77,26,0.3)" },
  medium: { bg: "rgba(200,255,0,0.1)", text: "#C8FF00", border: "rgba(200,255,0,0.25)" },
  low: { bg: "rgba(255,255,255,0.05)", text: "#8888AA", border: "rgba(255,255,255,0.1)" },
};

export default function TasksClient({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" as Task["priority"], due_date: "" });
  const [loading, setLoading] = useState(false);

  const filtered = tasks.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const task = await res.json();
      setTasks([task, ...tasks]);
      setForm({ title: "", description: "", priority: "medium", due_date: "" });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Tasks
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {tasks.filter((t) => !t.completed).length} remaining · {tasks.filter((t) => t.completed).length} done
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={createTask}
          className="glass-card p-5 mb-6 animate-fade-up"
        >
          <div className="space-y-3">
            <input
              autoFocus
              placeholder="Task title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <div className="flex gap-3">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm"
                style={{
                  background: "var(--bg-card-hover)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm"
                style={{
                  background: "var(--bg-card-hover)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost px-4 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !form.title.trim()}
                className="btn-primary px-4 py-2 rounded-xl text-sm"
              >
                {loading ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              background: filter === f ? "rgba(200,255,0,0.12)" : "var(--bg-card)",
              color: filter === f ? "var(--volt)" : "var(--text-secondary)",
              border: `1px solid ${filter === f ? "rgba(200,255,0,0.3)" : "var(--border)"}`,
            }}
          >
            {f}
          </button>
        ))}
        <div className="h-4 w-px" style={{ background: "var(--border)" }} />
        {(["all", "high", "medium", "low"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              background: filterPriority === p ? "var(--bg-card-hover)" : "transparent",
              color: filterPriority === p ? "var(--text-primary)" : "var(--text-muted)",
              border: `1px solid ${filterPriority === p ? "var(--border)" : "transparent"}`,
            }}
          >
            {p === "all" ? "All priorities" : p}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: "var(--text-muted)" }}>No tasks found</p>
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className="glass-card p-4 flex items-start gap-4 group hover:border-white/[0.12] transition-all duration-200"
              style={{ opacity: task.completed ? 0.6 : 1 }}
            >
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
              >
                {task.completed ? (
                  <CheckCircle2 size={20} style={{ color: "var(--volt)" }} />
                ) : (
                  <Circle size={20} style={{ color: "var(--text-muted)" }} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium leading-snug"
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
                  }}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={PRIORITY_COLORS[task.priority]}
                  >
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Due {format(new Date(task.due_date), "MMM d")}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10"
                style={{ color: "var(--text-muted)" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
