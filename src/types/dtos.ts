export type AuthorDto = {
  id: number
  name: string
}

export type CreateAuthorDto = {
  name: string
}

export type BookDto = {
  id: number
  title: string
  year: number
  authorId?: number | null
  authorName?: string | null
}

export type CreateBookDto = {
  title: string
  year: number
  authorId?: number | null
}