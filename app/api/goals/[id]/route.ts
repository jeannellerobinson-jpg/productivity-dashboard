import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, current_value, target_value, unit, deadline, status, color } = body;

    const [goal] = await sql`
      UPDATE goals SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        current_value = COALESCE(${current_value}, current_value),
        target_value = COALESCE(${target_value}, target_value),
        unit = COALESCE(${unit}, unit),
        deadline = COALESCE(${deadline}, deadline),
        status = COALESCE(${status}, status),
        color = COALESCE(${color}, color),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM goals WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
