import { NextRequest, NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

export async function GET() {
  try {
    await initDB();
    const notes = await sql`SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC`;
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const { title, content, color = "#1A1A26" } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [note] = await sql`
      INSERT INTO notes (title, content, color)
      VALUES (${title.trim()}, ${content || null}, ${color})
      RETURNING *
    `;

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
