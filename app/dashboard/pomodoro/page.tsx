import { sql } from "@/lib/db";
import PomodoroClient from "@/components/dashboard/PomodoroClient";

export default async function PomodoroPage() {
  try {
    const tasks = await sql`SELECT id, title FROM tasks WHERE completed = false ORDER BY created_at DESC LIMIT 20`;
    const sessions = await sql`SELECT ps.*, t.title AS task_title FROM pomodoro_sessions ps LEFT JOIN tasks t ON t.id = ps.task_id WHERE DATE(ps.started_at) = CURRENT_DATE ORDER BY ps.started_at DESC`;
    return <PomodoroClient tasks={tasks as any} sessions={sessions as any} />;
  } catch {
    return <PomodoroClient tasks={[]} sessions={[]} />;
  }
}
