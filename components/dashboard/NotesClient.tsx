"use client";

import { useState } from "react";
import { Plus, Trash2, Pin, PinOff, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";
import type { Note } from "@/types";

interface Props {
  initialNotes: Note[];
}

const NOTE_COLORS = ["#1A1A26", "#0D2010", "#1A0D10", "#0D1020", "#1A1500", "#1A0D00"];

export default function NotesClient({ initialNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: "", content: "", color: "#1A1A26" });
  const [loading, setLoading] = useState(false);

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const note = await res.json();
      setNotes([note, ...notes]);
      setForm({ title: "", content: "", color: "#1A1A26" });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!editingNote) return;
    const res = await fetch(`/api/notes/${editingNote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingNote.title, content: editingNote.content }),
    });
    const updated = await res.json();
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    setEditingNote(null);
  };

  const togglePin = async (id: string, pinned: boolean) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !pinned } : n))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)));
    await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !pinned }),
    });
  };

  const deleteNote = async (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Notes</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={createNote} className="glass-card p-5 mb-6 animate-fade-up">
          <div className="space-y-3">
            <input
              autoFocus
              placeholder="Note title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            <textarea
              placeholder="Write your note..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none leading-relaxed"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-4 py-2 rounded-xl text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading || !form.title.trim()} className="btn-primary px-4 py-2 rounded-xl text-sm">
                {loading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </form>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-16">
          <p style={{ color: "var(--text-muted)" }}>No notes yet. Capture your thoughts.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="break-inside-avoid glass-card p-5 group relative"
              style={{
                borderColor: note.pinned ? "rgba(200,255,0,0.2)" : "var(--border)",
              }}
            >
              {/* Actions */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => togglePin(note.id, note.pinned)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    background: note.pinned ? "rgba(200,255,0,0.1)" : "var(--bg-card-hover)",
                    color: note.pinned ? "var(--volt)" : "var(--text-muted)",
                  }}
                >
                  {note.pinned ? <Pin size={12} /> : <PinOff size={12} />}
                </button>
                <button
                  onClick={() => setEditingNote({ ...note })}
                  className="p-1.5 rounded-lg"
                  style={{ background: "var(--bg-card-hover)", color: "var(--text-muted)" }}
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {editingNote?.id === note.id ? (
                <div className="space-y-2">
                  <input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium"
                    style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                  <textarea
                    value={editingNote.content || ""}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                    style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                      <Check size={12} /> Save
                    </button>
                    <button onClick={() => setEditingNote(null)} className="btn-ghost px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2 mb-2 pr-20">
                    {note.pinned && (
                      <Pin size={12} style={{ color: "var(--volt)", flexShrink: 0, marginTop: 2 }} />
                    )}
                    <h3 className="font-semibold text-sm leading-snug">{note.title}</h3>
                  </div>
                  {note.content && (
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {note.content}
                    </p>
                  )}
                  <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                    {format(new Date(note.updated_at), "MMM d, h:mm a")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
