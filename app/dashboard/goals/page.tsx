import { sql } from "@/lib/db";
import GoalsClient from "@/components/dashboard/GoalsClient";

async function getGoals() {
  try {
    const goals = await sql`SELECT * FROM goals ORDER BY status ASC, created_at DESC`;
    return goals;
  } catch {
    return [];
  }
}

export default async function GoalsPage() {
  const goals = await getGoals();
  return <GoalsClient initialGoals={goals} />;
}
