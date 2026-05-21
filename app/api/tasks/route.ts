import { NextRequest, NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

export async function GET() {
  try {
    await initDB();
    const tasks = await sql`SELECT * FROM tasks ORDER BY completed ASC, priority DESC, created_at DESC`;
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const { title, description, priority = "medium", due_date } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [task] = await sql`
      INSERT INTO tasks (title, description, priority, due_date)
      VALUES (${title.trim()}, ${description || null}, ${priority}, ${due_date || null})
      RETURNING *
    `;

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
