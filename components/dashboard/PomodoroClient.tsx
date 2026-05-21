"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, Timer } from "lucide-react";

interface Task {
  id: string;
  title: string;
}

interface Session {
  id: string;
  duration_minutes: number;
  completed: boolean;
  task_title?: string;
  started_at: string;
}

interface Props {
  tasks: Task[];
  sessions: Session[];
}

type Phase = "work" | "break";

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroClient({ tasks, sessions: initSessions }: Props) {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [selectedTask, setSelectedTask] = useState("");
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(initSessions);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const totalSeconds = (phase === "work" ? workDuration : breakDuration) * 60;
  const progress = (timeLeft / totalSeconds) * CIRCUMFERENCE;

  const saveSession = useCallback(async (completed: boolean) => {
    const res = await fetch("/api/pomodoro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        duration_minutes: workDuration,
        break_minutes: breakDuration,
        task_id: selectedTask || null,
        completed,
      }),
    });
    const session = await res.json();
    const task = tasks.find((t) => t.id === selectedTask);
    setSessions((prev) => [{ ...session, task_title: task?.title }, ...prev]);
  }, [workDuration, breakDuration, selectedTask, tasks]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (phase === "work") {
              saveSession(true);
              setPhase("break");
              setTimeLeft(breakDuration * 60);
            } else {
              setPhase("work");
              setTimeLeft(workDuration * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phase, workDuration, breakDuration, saveSession]);

  const toggleTimer = () => {
    if (!running && timeLeft === totalSeconds && phase === "work") {
      // Fresh start — record session attempt
    }
    setRunning(!running);
  };

  const resetTimer = () => {
    setRunning(false);
    setPhase("work");
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const accentColor = phase === "work" ? "#C8FF00" : "#00C8FF";

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Focus</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {sessions.filter((s) => s.completed).length} sessions completed today
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Timer */}
        <div className="lg:col-span-3 glass-card p-8 flex flex-col items-center">
          {/* Phase indicator */}
          <div className="flex gap-2 mb-6">
            {(["work", "break"] as Phase[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  if (!running) {
                    setPhase(p);
                    setTimeLeft((p === "work" ? workDuration : breakDuration) * 60);
                  }
                }}
                className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
                style={{
                  background: phase === p ? `${p === "work" ? "#C8FF00" : "#00C8FF"}18` : "transparent",
                  color: phase === p ? (p === "work" ? "#C8FF00" : "#00C8FF") : "var(--text-muted)",
                  border: `1px solid ${phase === p ? (p === "work" ? "#C8FF0040" : "#00C8FF40") : "transparent"}`,
                }}
              >
                {p === "work" ? "Focus" : "Break"}
              </button>
            ))}
          </div>

          {/* Circular progress */}
          <div className="relative w-56 h-56 mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle
                cx="100" cy="100" r={RADIUS}
                fill="none"
                stroke="var(--bg-card-hover)"
                strokeWidth="8"
              />
              <circle
                cx="100" cy="100" r={RADIUS}
                fill="none"
                stroke={accentColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
                style={{ transition: running ? "stroke-dasharray 1s linear" : "none" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-bold tabular-nums"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: accentColor,
                }}
              >
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
                {phase === "work" ? "Focus time" : "Break time"}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetTimer}
              className="w-10 h-10 rounded-xl flex items-center justify-center btn-ghost"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={toggleTimer}
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background: accentColor,
                color: "#000",
                boxShadow: `0 0 24px ${accentColor}40`,
              }}
            >
              {running ? (
                <Pause size={24} strokeWidth={2.5} />
              ) : (
                <Play size={24} strokeWidth={2.5} className="ml-1" />
              )}
            </button>
            <button
              onClick={() => saveSession(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center btn-ghost"
              title="Mark complete"
            >
              <CheckCircle2 size={16} />
            </button>
          </div>

          {/* Duration settings */}
          {!running && (
            <div className="flex gap-4 mt-6 animate-fade-in">
              <div className="text-center">
                <label className="text-xs block mb-1" style={{ color: "var(--text-muted)" }}>Focus</label>
                <input
                  type="number"
                  value={workDuration}
                  min={1} max={90}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setWorkDuration(v);
                    if (phase === "work") setTimeLeft(v * 60);
                  }}
                  className="w-16 text-center px-2 py-1.5 rounded-lg text-sm font-mono"
                  style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <span className="text-xs block mt-1" style={{ color: "var(--text-muted)" }}>min</span>
              </div>
              <div className="text-center">
                <label className="text-xs block mb-1" style={{ color: "var(--text-muted)" }}>Break</label>
                <input
                  type="number"
                  value={breakDuration}
                  min={1} max={30}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setBreakDuration(v);
                    if (phase === "break") setTimeLeft(v * 60);
                  }}
                  className="w-16 text-center px-2 py-1.5 rounded-lg text-sm font-mono"
                  style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <span className="text-xs block mt-1" style={{ color: "var(--text-muted)" }}>min</span>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Task selector */}
          {tasks.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-3">Working on</h3>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{
                  background: "var(--bg-card-hover)",
                  border: "1px solid var(--border)",
                  color: selectedTask ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                <option value="">No task selected</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Session history */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Timer size={14} style={{ color: "var(--text-muted)" }} />
              Today&apos;s sessions
            </h3>
            {sessions.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No sessions yet today</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 py-2 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: s.completed ? "var(--volt)" : "var(--text-muted)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                        {s.task_title || "No task"}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono flex-shrink-0"
                      style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {s.duration_minutes}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
