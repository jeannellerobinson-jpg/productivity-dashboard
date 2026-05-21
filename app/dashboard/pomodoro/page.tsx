import { sql } from "@/lib/db";
import PomodoroClient from "@/components/dashboard/PomodoroClient";

async function getData() {
  try {
    const [tasks, sessions] = await Promise.all([
      sql`SELECT id, title FROM tasks WHERE completed = false ORDER BY created_at DESC LIMIT 20`,
      sql`
        SELECT ps.*, t.title AS task_title
        FROM pomodoro_sessions ps
        LEFT JOIN tasks t ON t.id = ps.task_id
        WHERE DATE(ps.started_at) = CURRENT_DATE
        ORDER BY ps.started_at DESC
      `,
    ]);
    return { tasks, sessions };
  } catch {
    return { tasks: [], sessions: [] };
  }
}

export default async function PomodoroPage() {
  const { tasks, sessions } = await getData();
  return <PomodoroClient tasks={tasks} sessions={sessions} />;
}
