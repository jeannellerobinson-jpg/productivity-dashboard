"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, CheckCircle2, Clock, X, ChevronDown } from "lucide-react";

interface Book {
  key: string;
  title: string;
  author: string;
  cover: string;
  year?: string;
  pages?: number;
}

interface TrackedBook {
  id: string;
  key: string;
  title: string;
  author: string;
  cover: string;
  status: "want_to_read" | "reading" | "finished";
  pages_total: number;
  pages_read: number;
  added_at: string;
}

const STATUS_LABELS = {
  want_to_read: { label: "Want to Read", color: "#B8978F", icon: Clock },
  reading: { label: "Reading", color: "#C87D87", icon: BookOpen },
  finished: { label: "Finished", color: "#6B7556", icon: CheckCircle2 },
};

export default function BooksPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [tracked, setTracked] = useState<TrackedBook[]>([]);
  const [activeTab, setActiveTab] = useState<"search" | "library">("library");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("momentum_books");
    if (saved) setTracked(JSON.parse(saved));
  }, []);

  const saveTracked = (books: TrackedBook[]) => {
    setTracked(books);
    localStorage.setItem("momentum_books", JSON.stringify(books));
  };

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&fields=key,title,author_name,cover_i,first_publish_year,number_of_pages_median`
      );
      const data = await res.json();
      const books = data.docs.map((doc: any) => ({
        key: doc.key,
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown Author",
        cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : "",
        year: doc.first_publish_year,
        pages: doc.number_of_pages_median,
      }));
      setResults(books);
    } finally {
      setSearching(false);
    }
  };

  const addBook = (book: Book, status: TrackedBook["status"]) => {
    if (tracked.find((t) => t.key === book.key)) return;
    const newBook: TrackedBook = {
      id: Date.now().toString(),
      key: book.key,
      title: book.title,
      author: book.author,
      cover: book.cover,
      status,
      pages_total: book.pages || 0,
      pages_read: 0,
      added_at: new Date().toISOString(),
    };
    saveTracked([newBook, ...tracked]);
  };

  const updateBook = (id: string, updates: Partial<TrackedBook>) => {
    saveTracked(tracked.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBook = (id: string) => {
    saveTracked(tracked.filter((b) => b.id !== id));
  };

  const byStatus = (status: TrackedBook["status"]) => tracked.filter((b) => b.status === status);

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Books</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {byStatus("reading").length} reading · {byStatus("finished").length} finished
          </p>
        </div>
        <div className="flex gap-2">
          {(["library", "search"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? "var(--volt)" : "var(--bg-card)",
                color: activeTab === tab ? "#fff" : "var(--text-secondary)",
                border: `1px solid ${activeTab === tab ? "var(--volt)" : "var(--border)"}`,
              }}>
              {tab === "library" ? "My Library" : "Search Books"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "search" ? (
        <div>
          <form onSubmit={searchBooks} className="flex gap-3 mb-6">
            <input
              autoFocus
              placeholder="Search by title, author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            <button type="submit" className="btn-primary px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Search size={16} /> Search
            </button>
          </form>

          {searching && <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>Searching...</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((book) => {
              const isTracked = tracked.find((t) => t.key === book.key);
              return (
                <div key={book.key} className="glass-card p-3 group">
                  <div className="relative mb-3">
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} className="w-full h-44 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-44 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-card-hover)" }}>
                        <BookOpen size={32} style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-xs leading-snug line-clamp-2 mb-0.5">{book.title}</p>
                  <p className="text-xs mb-2 truncate" style={{ color: "var(--text-muted)" }}>{book.author}</p>
                  {book.year && <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{book.year}</p>}

                  {isTracked ? (
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(107, 117, 86, 0.15)", color: "#6B7556" }}>
                      ✓ In library
                    </span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {(["want_to_read", "reading", "finished"] as const).map((s) => (
                        <button key={s} onClick={() => addBook(book, s)}
                          className="text-xs px-2 py-1 rounded-lg text-left transition-all"
                          style={{ background: "var(--bg-card-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                          + {STATUS_LABELS[s].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {(["reading", "want_to_read", "finished"] as const).map((status) => {
            const books = byStatus(status);
            if (books.length === 0) return null;
            const { label, color, icon: Icon } = STATUS_LABELS[status];
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={16} style={{ color }} />
                  <h2 className="font-semibold text-sm" style={{ color }}>{label}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{books.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((book) => {
                    const progress = book.pages_total > 0 ? Math.min(100, Math.round((book.pages_read / book.pages_total) * 100)) : 0;
                    return (
                      <div key={book.id} className="glass-card p-4 flex gap-3 group relative">
                        <button onClick={() => removeBook(book.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg" style={{ color: "var(--text-muted)" }}>
                          <X size={12} />
                        </button>

                        {book.cover ? (
                          <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-20 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "var(--bg-card-hover)" }}>
                            <BookOpen size={20} style={{ color: "var(--text-muted)" }} />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs leading-snug line-clamp-2 mb-0.5">{book.title}</p>
                          <p className="text-xs mb-2 truncate" style={{ color: "var(--text-muted)" }}>{book.author}</p>

                          <select
                            value={book.status}
                            onChange={(e) => updateBook(book.id, { status: e.target.value as TrackedBook["status"] })}
                            className="w-full text-xs px-2 py-1 rounded-lg mb-2"
                            style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color }}
                          >
                            <option value="want_to_read">Want to Read</option>
                            <option value="reading">Reading</option>
                            <option value="finished">Finished</option>
                          </select>

                          {status === "reading" && (
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <input
                                  type="number"
                                  value={book.pages_read || ""}
                                  placeholder="0"
                                  onChange={(e) => updateBook(book.id, { pages_read: Number(e.target.value) })}
                                  className="w-14 text-xs px-2 py-1 rounded-lg"
                                  style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                />
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                  / {book.pages_total || "?"} pages
                                </span>
                              </div>
                              {book.pages_total > 0 && (
                                <div>
                                  <div className="h-1.5 rounded-full overflow-hidden mb-0.5" style={{ background: "var(--bg-card-hover)" }}>
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: color }} />
                                  </div>
                                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{progress}%</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {tracked.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={40} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
              <p style={{ color: "var(--text-muted)" }}>No books yet.</p>
              <button onClick={() => setActiveTab("search")} className="mt-3 text-sm" style={{ color: "var(--volt)" }}>
                Search for books →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
