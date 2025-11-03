// src/App.tsx
import { useEffect, useMemo, useState } from "react";

// Navbar with built-in search
import Navbar from "@/components/Navbar";

import BookCard from "@/components/BookCard";
import AuthorCard from "@/components/AuthorCard";
import AddAuthorForm from "@/components/tabs/AddAuthorForm";
import AddBookForm from "@/components/tabs/AddBookForm";
import NavigationTabs from "@/components/tabs/NavogationTabs";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider"; 

import type { AuthorInput } from "@/types/Authors";
import type { AuthorDto, BookDto } from "@/types/dtos";

import { authorsService } from "@/services/authorsService";
import { booksService } from "@/services/booksService";

type Tab = "books" | "authors" | "add-author" | "add-book";

const coverFromIsbn = (isbn?: string) =>
  isbn && isbn.trim()
    ? `https://books.google.com/books/content?vid=ISBN${encodeURIComponent(
        isbn.trim()
      )}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
    : undefined;

type NewBookInput = {
  title: string;
  authorId?: number;
  publishedYear: number;
  isbn?: string;
  coverUrl?: string;
  description?: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [authors, setAuthors] = useState<AuthorDto[]>([]);
  const [books, setBooks] = useState<BookDto[]>([]);
  const [q, setQ] = useState(""); // driven by Navbar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // track deletions
  const [deletingBookIds, setDeletingBookIds] = useState<Set<number>>(new Set());
  const [deletingAuthorIds, setDeletingAuthorIds] = useState<Set<number>>(new Set());

  // initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [a, b] = await Promise.all([authorsService.getAll(), booksService.getAll()]);
        if (!alive) return;
        setAuthors(a);
        setBooks(b);
      } catch (e: any) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // filters
  const filteredBooks = useMemo(() => {
    if (!q.trim()) return books;
    const term = q.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        (b.authorName ?? "").toLowerCase().includes(term) ||
        String(b.year).includes(term)
    );
  }, [q, books]);

  const filteredAuthors = useMemo(() => {
    if (!q.trim()) return authors;
    const term = q.toLowerCase();
    return authors.filter((a) => a.name.toLowerCase().includes(term));
  }, [q, authors]);

  // actions
  const handleAddAuthor = async (author: AuthorInput) => {
    try {
      setLoading(true);
      setError(null);
      const created = await authorsService.create({ name: author.name });
      setAuthors((prev) => [created, ...prev]);
      setActiveTab("authors");
    } catch (e: any) {
      setError(e?.message || "Failed to add author");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book: NewBookInput) => {
    try {
      setLoading(true);
      setError(null);

      const created = await booksService.create({
        title: book.title,
        year: Number(book.publishedYear),
        authorId: book.authorId ?? null,
      });

      const withExtras: BookDto = {
        ...created,
        isbn: book.isbn,
        description: book.description,
        coverUrl: book.coverUrl?.trim() ? book.coverUrl : coverFromIsbn(book.isbn),
      };

      setBooks((prev) => [withExtras, ...prev]);
      setActiveTab("books");
    } catch (e: any) {
      setError(e?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm("Delete this book?")) return;

    const prev = books;
    setBooks((cur) => cur.filter((b) => b.id !== id));
    setDeletingBookIds((s) => new Set(s).add(id));
    setError(null);

    try {
      await booksService.remove(id);
    } catch (e: any) {
      setBooks(prev); // rollback
      setError(e?.message || "Failed to delete book");
    } finally {
      setDeletingBookIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!window.confirm("Delete this author?")) return;
    const prev = authors;
    setAuthors((cur) => cur.filter((a) => a.id !== id));
    setDeletingAuthorIds((s) => new Set(s).add(id));
    setError(null);
    try {
      await authorsService.remove(id);
      setBooks((cur) =>
        cur.map((b) =>
          b.authorId === id ? { ...b, authorId: null, authorName: "Unknown" } : b
        )
      );
    } catch (e: any) {
      setAuthors(prev);
      setError(e?.message || "Failed to delete author");
    } finally {
      setDeletingAuthorIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div
      className={[
        "min-h-dvh text-zinc-100",
        "bg-[#0b1220]",
        "[background-image:radial-gradient(1200px_400px_at_50%_-10%,rgba(34,197,94,.085),transparent_60%),radial-gradient(1200px_400px_at_50%_120%,rgba(59,130,246,.09),transparent_60%)]",
      ].join(" ")}
    >
      {/* Navbar with search bound to `q` */}
      <Navbar
        searchTerm={q}
        onSearchChange={setQ}
        onSearchSubmit={() =>
          document.getElementById("books")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* ===== HERO BAND ===== */}
      <section
        className={[
          "relative isolate",
          // cyan glow behind the right side of the hero
          "before:pointer-events-none before:absolute before:inset-y-0 before:right-0",
          "before:w-[55%] before:bg-[radial-gradient(700px_260px_at_60%_35%,rgba(56,189,248,.10),transparent_70%)]",
        ].join(" ")}
      >
        <HeroSection />
      </section>

      {/* divider */}
      <SectionDivider />

      {/* ===== CONTENT BAND (raised/frosted surface) ===== */}
      <section
        className={[
          "relative isolate",
          "mx-auto max-w-[1400px] rounded-[32px] bg-white/[0.035] backdrop-blur",
          "ring-1 ring-white/10 shadow-[0_50px_160px_rgba(6,182,212,.10),0_20px_60px_rgba(34,197,94,.07)]",
          "px-4 md:px-6 lg:px-8 py-6 md:py-8",
        ].join(" ")}
      >
        {/* controls */}
        <div className="mx-auto max-w-6xl">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            booksCount={books.length}
            authorsCount={authors.length}
          />
          {loading && <div className="mt-3 text-sm text-zinc-300">Loading…</div>}
          {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        </div>

        {/* content */}
        <main id="books" className="mx-auto max-w-6xl py-6">
          {activeTab === "books" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((b) => {
                const dto = authors.find((a) => a.id === b.authorId);
                const authorName = dto ? dto.name : b.authorName ?? "Unknown";
                const cover =
                  b.coverUrl && b.coverUrl.trim().length > 0
                    ? b.coverUrl
                    : coverFromIsbn(b.isbn);

                return (
                  <BookCard
                    key={b.id}
                    coverUrl={cover}
                    title={b.title}
                    author={authorName}
                    onDelete={() => handleDeleteBook(b.id)}   // keep your delete wiring
                    deleting={deletingBookIds.has(b.id)}
                  />
                );
              })}
              {!loading && filteredBooks.length === 0 && (
                <p className="text-zinc-300/80">No books.</p>
              )}
            </div>
          )}

          {activeTab === "authors" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAuthors.map((a) => {
                const bookCount = books.filter((b) => b.authorId === a.id).length;
                const deleting = deletingAuthorIds.has(a.id);
                return (
                  <AuthorCard
                    key={a.id}
                    author={{ id: a.id, name: a.name, bio: "", birthYear: 0, country: "" }}
                    bookCount={bookCount}
                    onDelete={handleDeleteAuthor}
                    deleting={deleting}
                  />
                );
              })}
              {!loading && filteredAuthors.length === 0 && (
                <p className="text-zinc-300/80">No authors.</p>
              )}
            </div>
          )}

          {activeTab === "add-author" && (
            <AddAuthorForm onSubmit={handleAddAuthor} onCancel={() => setActiveTab("authors")} />
          )}

          {activeTab === "add-book" && (
            <AddBookForm
              authors={authors.map((a) => ({ id: a.id, name: a.name }))}
              onSubmit={handleAddBook}
              onCancel={() => setActiveTab("books")}
            />
          )}
        </main>
      </section>

      <div className="h-10" />
    </div>
  );
}
