import { NextRequest, NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

export async function GET() {
  try {
    await initDB();
    const goals = await sql`SELECT * FROM goals ORDER BY status ASC, created_at DESC`;
    return NextResponse.json(goals);
  } catch {
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const {
      title,
      description,
      target_value = 100,
      current_value = 0,
      unit = "%",
      deadline,
      color = "#00C8FF",
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [goal] = await sql`
      INSERT INTO goals (title, description, target_value, current_value, unit, deadline, color)
      VALUES (${title.trim()}, ${description || null}, ${target_value}, ${current_value}, ${unit}, ${deadline || null}, ${color})
      RETURNING *
    `;

    return NextResponse.json(goal, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
