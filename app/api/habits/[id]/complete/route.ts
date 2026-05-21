import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { date } = await request.json();
    const completionDate = date || new Date().toISOString().split("T")[0];

    // Check if already completed
    const existing = await sql`
      SELECT id FROM habit_completions
      WHERE habit_id = ${params.id} AND completed_date = ${completionDate}
    `;

    if (existing.length > 0) {
      // Toggle off
      await sql`
        DELETE FROM habit_completions
        WHERE habit_id = ${params.id} AND completed_date = ${completionDate}
      `;
      return NextResponse.json({ completed: false });
    } else {
      // Toggle on
      await sql`
        INSERT INTO habit_completions (habit_id, completed_date)
        VALUES (${params.id}, ${completionDate})
        ON CONFLICT (habit_id, completed_date) DO NOTHING
      `;
      return NextResponse.json({ completed: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle habit" }, { status: 500 });
  }
}
