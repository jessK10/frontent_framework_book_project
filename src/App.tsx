import { useEffect, useMemo, useState } from "react"
import { BookOpen } from "lucide-react"

import BookCard from "./components/BookCard"
import AuthorCard from "./components/AuthorCard"
import SearchBar from "./components/tabs/SearchBar"
import AddAuthorForm from "./components/tabs/AddAuthorForm"
import AddBookForm from "./components/tabs/AddBookForm"
import NavigationTabs from "./components/tabs/NavogationTabs"

import type { Author as UiAuthor } from "./types/Authors"
import type { Book as UiBook } from "./types/Book"
import type { AuthorDto, BookDto } from "./types/dtos"

import { authorsService } from "./services/authorsService"
import { booksService } from "./services/booksService"

type Tab = "books" | "authors" | "add-author" | "add-book"

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>("books")

  const [authors, setAuthors] = useState<AuthorDto[]>([])
  const [books, setBooks] = useState<BookDto[]>([])

  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // initial load from API
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const [a, b] = await Promise.all([authorsService.getAll(), booksService.getAll()])
        if (!alive) return
        setAuthors(a)
        setBooks(b)
      } catch (e: any) {
        setError(e.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // simple client-side filtering
  const filteredBooks = useMemo(() => {
    if (!q.trim()) return books
    const term = q.toLowerCase()
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        (b.authorName ?? "").toLowerCase().includes(term) ||
        String(b.year).includes(term)
    )
  }, [q, books])

  const filteredAuthors = useMemo(() => {
    if (!q.trim()) return authors
    const term = q.toLowerCase()
    return authors.filter((a) => a.name.toLowerCase().includes(term))
  }, [q, authors])

  // handlers
  const handleAddAuthor = async (author: UiAuthor) => {
    try {
      setLoading(true)
      setError(null)
      const created = await authorsService.create({ name: author.name })
      setAuthors((prev) => [created, ...prev])
      setActiveTab("authors")
    } catch (e: any) {
      setError(e.message || "Failed to add author")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (book: UiBook) => {
    try {
      setLoading(true)
      setError(null)
      const created = await booksService.create({
        title: book.title,
        year: Number(book.publishedYear),
        authorId: book.authorId || undefined,
      })
      setBooks((prev) => [created, ...prev])
      setActiveTab("books")
    } catch (e: any) {
      setError(e.message || "Failed to add book")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-3">
          <BookOpen />
          <h1 className="text-2xl font-semibold">Books & Authors</h1>
        </div>
      </header>

      {/* controls */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* NavigationTabs expects activeTab + setActiveTab */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {/* SearchBar expects q + setQ */}
          <SearchBar q={q} setQ={(v: string) => setQ(v)} />
        </div>
        {loading && <div className="mt-3 text-sm text-gray-600">Loading…</div>}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      {/* content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "books" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((b) => (
              <BookCard
                key={b.id}
                book={{
                  id: b.id,
                  title: b.title,
                  authorId: b.authorId ?? 0,
                  isbn: "",
                  publishedYear: b.year,
                  description: "",
                  coverUrl: "",
                }}
                author={b.authorName ?? ""}
              />
            ))}
            {!loading && filteredBooks.length === 0 && (
              <p className="text-gray-500">No books.</p>
            )}
          </div>
        )}

        {activeTab === "authors" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAuthors.map((a) => {
              const bookCount = books.filter((b) => b.authorId === a.id).length
              return (
                <AuthorCard
                  key={a.id}
                  author={{ id: a.id, name: a.name, bio: "", birthYear: 0, country: "" }}
                  bookCount={bookCount}
                />
              )
            })}
            {!loading && filteredAuthors.length === 0 && (
              <p className="text-gray-500">No authors.</p>
            )}
          </div>
        )}

        {activeTab === "add-author" && (
          <AddAuthorForm onSubmit={handleAddAuthor} onCancel={() => setActiveTab("authors")} />
        )}

        {activeTab === "add-book" && (
          <AddBookForm
            authors={authors.map((a) => ({
              id: a.id,
              name: a.name,
              bio: "",
              birthYear: 0,
              country: "",
            }))}
            onSubmit={handleAddBook}
            onCancel={() => setActiveTab("books")}
          />
        )}
      </main>
    </div>
  )
}

export default App
