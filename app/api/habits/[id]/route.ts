import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM habits WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
