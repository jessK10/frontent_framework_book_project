import BookCard from "@/components/BookCard"

export type BookShowItem = {
  coverUrl?: string
  title: string
  author: string
  rating?: number        // optional; BookCard supports it
  ratingsCount?: number
  pages?: number
  format?: string
  category?: string
  infoUrl?: string
}

export default function BookShowGrid({ items }: { items: BookShowItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b, i) => (
        <BookCard key={i} {...b} />
      ))}
    </div>
  )
}
