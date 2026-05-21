import { sql } from "@/lib/db";
import TasksClient from "@/components/dashboard/TasksClient";

async function getTasks() {
  try {
    const tasks = await sql`SELECT * FROM tasks ORDER BY completed ASC, priority DESC, created_at DESC`;
    return tasks;
  } catch {
    return [];
  }
}

export default async function TasksPage() {
  const tasks = await getTasks();
  return <TasksClient initialTasks={tasks} />;
}
