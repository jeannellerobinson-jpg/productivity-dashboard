import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, pinned, color } = body;

    const [note] = await sql`
      UPDATE notes SET
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        pinned = COALESCE(${pinned}, pinned),
        color = COALESCE(${color}, color),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM notes WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
