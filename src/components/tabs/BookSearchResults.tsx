import type { GoogleBook } from "../../services/googleBooksService"

interface Props {
  results: GoogleBook[]
  onSelect: (book: GoogleBook) => void
  onClear: () => void
  isSearching?: boolean
}

export default function BookSearchResults({ results, onSelect, onClear, isSearching }: Props) {
  if (isSearching) {
    return <div className="mt-2 rounded-lg border p-3 text-sm text-gray-600">Searching…</div>
  }
  if (!results.length) return null

  return (
    <div className="mt-2 max-h-80 overflow-auto rounded-lg border bg-white">
      {results.map((b, idx) => (
        <button
          key={b.id}
          type="button"
          className={`w-full text-left p-3 hover:bg-gray-50 border-b ${
            idx === results.length - 1 ? "border-b-0" : ""
          }`}
          onClick={() => {
            onSelect(b)
            onClear()
          }}
        >
          <div className="flex gap-3">
            {b.thumbnail && (
              <img
                src={b.thumbnail}
                alt={b.title}
                className="w-12 h-16 object-cover rounded"
                onError={(e) => ((e.currentTarget.style.display = "none"))}
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">{b.title}</p>
              <p className="text-xs text-gray-600 mt-1">{b.author || "Unknown author"}</p>

              <div className="flex gap-2 mt-1">
                {b.publishedDate && (
                  <span className="text-xs text-gray-500">{b.publishedDate}</span>
                )}
                {b.isbn ? (
                  <span className="text-xs text-blue-600">ISBN: {b.isbn}</span>
                ) : (
                  <span className="text-xs text-red-500">No ISBN available</span>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}