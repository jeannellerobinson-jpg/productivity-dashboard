import { NextRequest, NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

export async function GET() {
  try {
    await initDB();
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
    return NextResponse.json(habits);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const { name, description, frequency = "daily", color = "#C8FF00" } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [habit] = await sql`
      INSERT INTO habits (name, description, frequency, color)
      VALUES (${name.trim()}, ${description || null}, ${frequency}, ${color})
      RETURNING *
    `;

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
