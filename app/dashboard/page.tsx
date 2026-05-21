import { sql } from "@/lib/db";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { format } from "date-fns";

async function getDashboardData() {
  try {
    const [tasks, habits, goals, notes, pomodoroToday] = await Promise.all([
      sql`SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5`,
      sql`
        SELECT h.*,
          (SELECT COUNT(*) FROM habit_completions hc
           WHERE hc.habit_id = h.id
           AND hc.completed_date = CURRENT_DATE) > 0 AS completed_today,
          (SELECT COUNT(*) FROM habit_completions hc2
           WHERE hc2.habit_id = h.id
           AND hc2.completed_date >= CURRENT_DATE - INTERVAL '6 days') AS streak
        FROM habits h
        ORDER BY h.created_at DESC
        LIMIT 6
      `,
      sql`SELECT * FROM goals WHERE status = 'active' ORDER BY created_at DESC LIMIT 4`,
      sql`SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC LIMIT 4`,
      sql`
        SELECT COUNT(*) AS count FROM pomodoro_sessions
        WHERE completed = true AND DATE(started_at) = CURRENT_DATE
      `,
    ]);

    const statsResult = await sql`
      SELECT
        (SELECT COUNT(*) FROM tasks) AS tasks_total,
        (SELECT COUNT(*) FROM tasks WHERE completed = true) AS tasks_completed,
        (SELECT COUNT(*) FROM habits) AS habits_total,
        (SELECT COUNT(*) FROM goals WHERE status = 'active') AS goals_active
    `;

    return {
      tasks,
      habits,
      goals,
      notes,
      stats: {
        ...statsResult[0],
        pomodoros_today: parseInt(pomodoroToday[0]?.count ?? "0"),
        habits_today: habits.filter((h: { completed_today: boolean }) => h.completed_today).length,
      },
    };
  } catch {
    return {
      tasks: [],
      habits: [],
      goals: [],
      notes: [],
      stats: {
        tasks_total: 0,
        tasks_completed: 0,
        habits_total: 0,
        habits_today: 0,
        goals_active: 0,
        pomodoros_today: 0,
      },
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const today = format(new Date(), "EEEE, MMMM d");

  return <DashboardClient data={data} today={today} />;
}
