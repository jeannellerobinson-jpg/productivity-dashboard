import { sql } from "@/lib/db";
import GoalsClient from "@/components/dashboard/GoalsClient";
import type { Goal } from "@/types";

async function getGoals() {
  try {
    const goals = await sql`SELECT * FROM goals ORDER BY status ASC, created_at DESC`;
    return goals as unknown as Goal[];
  } catch {
    return [];
  }
}

export default async function GoalsPage() {
  const goals = await getGoals();
  return <GoalsClient initialGoals={goals} />;
}