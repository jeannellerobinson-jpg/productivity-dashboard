import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, completed, priority, due_date } = body;

    const [task] = await sql`
      UPDATE tasks SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        completed = COALESCE(${completed}, completed),
        priority = COALESCE(${priority}, priority),
        due_date = COALESCE(${due_date}, due_date),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM tasks WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
