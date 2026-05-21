import { sql } from "@/lib/db";
import TasksClient from "@/components/dashboard/TasksClient";

export default async function TasksPage() {
  try {
    const tasks = await sql`SELECT * FROM tasks ORDER BY completed ASC, priority DESC, created_at DESC`;
    return <TasksClient initialTasks={tasks as any} />;
  } catch {
    return <TasksClient initialTasks={[]} />;
  }
}
