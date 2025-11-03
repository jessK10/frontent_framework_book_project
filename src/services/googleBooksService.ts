// src/services/googleBooksService.ts

export type GoogleBook = {
  id: string
  title: string
  author?: string
  publishedDate?: string
  isbn?: string
  thumbnail?: string
  infoLink?: string          // NEW: direct link to the book page
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

function toHttps(url?: string) {
  return url ? url.replace("http://", "https://") : undefined
}

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
    thumbnail: toHttps(info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail),
    infoLink: toHttps(info.infoLink || item.selfLink), // NEW
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

/**
 * Internal: get the first GoogleBooks match by title (+ optional author).
 */
export async function findFirstByTitleAuthor(
  title: string,
  author?: string
): Promise<GoogleBook | undefined> {
  const cleanTitle = title?.trim()
  if (!cleanTitle) return undefined

  const q: string[] = [`intitle:${cleanTitle}`]
  if (author?.trim()) q.push(`inauthor:${author.trim()}`)

  const params = new URLSearchParams({
    q: q.join("+"),
    maxResults: "1",
  })

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}?${params.toString()}`)
    if (!res.ok) return undefined
    const data = await res.json()
    const item = data?.items?.[0]
    return item ? transformGoogleBook(item) : undefined
  } catch {
    return undefined
  }
}

/**
 * Find a single cover image by title (+ optional author).
 * Returns a secure (https) thumbnail URL or undefined.
 */
export async function findCoverByTitleAuthor(
  title: string,
  author?: string
): Promise<string | undefined> {
  const first = await findFirstByTitleAuthor(title, author)
  return first?.thumbnail
}

/**
 * Find a public info link for a book by title (+ optional author).
 * Returns an https URL to Google Books (or undefined if not found).
 */
export async function findLinkByTitleAuthor(
  title: string,
  author?: string
): Promise<string | undefined> {
  const first = await findFirstByTitleAuthor(title, author)
  return first?.infoLink
}
