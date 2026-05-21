import { NextRequest, NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

export async function GET() {
  try {
    await initDB();
    const sessions = await sql`
      SELECT ps.*, t.title AS task_title
      FROM pomodoro_sessions ps
      LEFT JOIN tasks t ON t.id = ps.task_id
      WHERE DATE(ps.started_at) = CURRENT_DATE
      ORDER BY ps.started_at DESC
    `;
    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const { duration_minutes = 25, break_minutes = 5, task_id, completed = false } = body;

    const [session] = await sql`
      INSERT INTO pomodoro_sessions (duration_minutes, break_minutes, task_id, completed, completed_at)
      VALUES (
        ${duration_minutes},
        ${break_minutes},
        ${task_id || null},
        ${completed},
        ${completed ? "NOW()" : null}
      )
      RETURNING *
    `;

    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
