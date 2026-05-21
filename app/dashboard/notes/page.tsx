import { sql } from "@/lib/db";
import NotesClient from "@/components/dashboard/NotesClient";

async function getNotes() {
  try {
    const notes = await sql`SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC`;
    return notes;
  } catch {
    return [];
  }
}

export default async function NotesPage() {
  const notes = await getNotes();
  return <NotesClient initialNotes={notes} />;
}
