import { useMemo, useState } from "react"
import BookSearchResults from "./BookSearchResults"
import { searchBooksByTitle, type GoogleBook } from "../../services/googleBooksService"

type AuthorLite = { id: number; name: string }

interface Props {
  authors: AuthorLite[]
  onSubmit: (book: {
    title: string
    authorId?: number
    publishedYear: number
    // UI-only
    isbn?: string
    coverUrl?: string
    description?: string
  }) => void
  onCancel: () => void
}

type FormState = {
  title: string
  authorId: number
  publishedYear: number
  isbn: string
  coverUrl: string
  description: string
}

export default function AddBookForm({ authors, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    authorId: 0,
    publishedYear: new Date().getFullYear(),
    isbn: "",
    coverUrl: "",
    description: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [results, setResults] = useState<GoogleBook[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const authorOptions = useMemo<AuthorLite[]>(
    () => [{ id: 0, name: "Unknown" }, ...authors],
    [authors]
  )

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "authorId" || name === "publishedYear" ? parseInt(value || "0", 10) : value,
    }))

    // clear field error when user edits
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // live Google search
    if (name === "title") {
      const q = value.trim()
      if (q.length > 2) {
        setIsSearching(true)
        searchBooksByTitle(q)
          .then(setResults)
          .catch(() => setResults([]))
          .finally(() => setIsSearching(false))
      } else {
        setResults([])
      }
    }
  }

  // when user picks a Google result, prefill + check author against backend
  const handlePick = (b: GoogleBook) => {
    // 1) Prefill fields from Google result
    const pickedYear = b.publishedDate
      ? parseInt(String(b.publishedDate).slice(0, 4), 10)
      : NaN

    // 2) Try to match author by name
    const pickedAuthorName = (b.author || "").trim().toLowerCase()
    const matched = authors.find(
      (a) => a.name.trim().toLowerCase() === pickedAuthorName && a.id > 0
    )

    setFormData((prev) => ({
      ...prev,
      title: b.title || prev.title,
      publishedYear: !isNaN(pickedYear) ? pickedYear : prev.publishedYear,
      isbn: b.isbn || prev.isbn,
      coverUrl: b.thumbnail || prev.coverUrl,
      authorId: matched ? matched.id : 0, // select match or Unknown
    }))

    // 3) Set/clear authorId error depending on match
    setErrors((prev) => ({
      ...prev,
      authorId: matched ? "" : "No matching author found. Please select manually.",
    }))

    // 4) Hide suggestions
    setResults([])
  }

  const clearResults = () => setResults([])

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!formData.title.trim()) next.title = "Title is required"
    if (!formData.publishedYear || isNaN(formData.publishedYear))
      next.publishedYear = "Year is required"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit: React.FormEventHandler = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      title: formData.title.trim(),
      authorId: formData.authorId || undefined,
      publishedYear: formData.publishedYear,
      // UI-only fields
      isbn: formData.isbn || undefined,
      coverUrl: formData.coverUrl || undefined,
      description: formData.description || undefined,
    })

    // optional reset
    setFormData({
      title: "",
      authorId: 0,
      publishedYear: new Date().getFullYear(),
      isbn: "",
      coverUrl: "",
      description: "",
    })
    clearResults()
  }

  return (
    <form onSubmit={submit} className="bg-white border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Add New Book</h2>

      {/* Title + Google suggestions */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter book title"
          autoComplete="off"
        />

        <BookSearchResults
          results={results}
          isSearching={isSearching}
          onSelect={handlePick}
          onClear={clearResults}
        />
      </div>

      {/* Author (preselected if matched) */}
      <div className="mb-4">
        <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
          Author
        </label>
        <select
          id="authorId"
          name="authorId"
          value={formData.authorId}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
            errors.authorId ? "border-red-500" : "border-gray-300"
          }`}
        >
          {authorOptions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {errors.authorId && <p className="text-xs mt-1 text-red-600">{errors.authorId}</p>}
      </div>

      {/* Year */}
      <div className="mb-4">
        <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
          Published year
        </label>
        <input
          id="publishedYear"
          name="publishedYear"
          type="number"
          value={formData.publishedYear}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
            errors.publishedYear ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.publishedYear && (
          <p className="text-xs mt-1 text-red-600">{errors.publishedYear}</p>
        )}
      </div>

      {/* Optional UI-only fields */}
      <div className="mb-4">
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
          ISBN (optional)
        </label>
        <input
          id="isbn"
          name="isbn"
          type="text"
          value={formData.isbn}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700">
          Cover URL (optional)
        </label>
        <input
          id="coverUrl"
          name="coverUrl"
          type="text"
          value={formData.coverUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300"
          placeholder="https://…"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
