import { sql } from "@/lib/db";
import GoalsClient from "@/components/dashboard/GoalsClient";

async function getGoals() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const goals = await sql`SELECT * FROM goals ORDER BY status ASC, created_at DESC` as any[];
    return goals;
  } catch {
    return [];
  }
}

export default async function GoalsPage() {
  const goals = await getGoals();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <GoalsClient initialGoals={goals as any} />;
}
