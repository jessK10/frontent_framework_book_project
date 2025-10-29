export type GoogleBook = {
  id: string
  title: string
  author?: string
  publishedDate?: string
  isbn?: string
  thumbnail?: string
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

function transformGoogleBook(item: any): GoogleBook {
  const info = item?.volumeInfo ?? {}

  // Prefer ISBN_13, fall back to ISBN_10
  const identifiers: Array<{ type: string; identifier: string }> =
    info.industryIdentifiers || []
  const isbn13 = identifiers.find((x) => x.type === "ISBN_13")?.identifier
  const isbn10 = identifiers.find((x) => x.type === "ISBN_10")?.identifier

  return {
    id: item.id,
    title: info.title || "Untitled",
    author: (info.authors && info.authors[0]) || undefined,
    publishedDate: info.publishedDate || undefined,
    isbn: isbn13 || isbn10 || undefined,
    thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || undefined,
  }
}

/**
 * Search books by title using Google Books API.
 * Returns up to 40 transformed results.
 */
export async function searchBooksByTitle(title: string): Promise<GoogleBook[]> {
  if (!title.trim()) return []

  try {
    const params = new URLSearchParams({
      q: `intitle:${title}`,
      maxResults: "40",
    })
    const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`)
    if (!res.ok) throw new Error(`Google API failed: ${res.status}`)

    const data = await res.json()
    const items: any[] = data?.items || []
    return items.map(transformGoogleBook)
  } catch (err) {
    console.error("Google Books search error:", err)
    return []
  }
}