import { sql } from "@/lib/db";
import NotesClient from "@/components/dashboard/NotesClient";

export default async function NotesPage() {
  try {
    const notes = await sql`SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC`;
    return <NotesClient initialNotes={notes as any} />;
  } catch {
    return <NotesClient initialNotes={[]} />;
  }
}
