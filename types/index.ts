export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  color: string;
  created_at: string;
  completions?: HabitCompletion[];
  streak?: number;
  completed_today?: boolean;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
  created_at: string;
}

export interface Goal {
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
  progress?: number;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  pinned: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface PomodoroSession {
  id: string;
  duration_minutes: number;
  break_minutes: number;
  completed: boolean;
  task_id?: string;
  started_at: string;
  completed_at?: string;
}

export interface DashboardStats {
  tasks_total: number;
  tasks_completed: number;
  habits_today: number;
  habits_total: number;
  goals_active: number;
  pomodoros_today: number;
}
