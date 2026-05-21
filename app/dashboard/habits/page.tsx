import { sql } from "@/lib/db";
import HabitsClient from "@/components/dashboard/HabitsClient";

export default async function HabitsPage() {
  try {
    const habits = await sql`
      SELECT h.*,
        (SELECT COUNT(*) FROM habit_completions hc
         WHERE hc.habit_id = h.id
         AND hc.completed_date = CURRENT_DATE) > 0 AS completed_today,
        (SELECT COUNT(*) FROM habit_completions hc2
         WHERE hc2.habit_id = h.id
         AND hc2.completed_date >= CURRENT_DATE - INTERVAL '29 days') AS completions_30d,
        ARRAY(
          SELECT hc3.completed_date::text
          FROM habit_completions hc3
          WHERE hc3.habit_id = h.id
          AND hc3.completed_date >= CURRENT_DATE - INTERVAL '29 days'
          ORDER BY hc3.completed_date
        ) AS completion_dates
      FROM habits h
      ORDER BY h.created_at ASC
    `;
    return <HabitsClient initialHabits={habits as any} />;
  } catch {
    return <HabitsClient initialHabits={[]} />;
  }
}
