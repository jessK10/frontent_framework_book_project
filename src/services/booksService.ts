import { http } from './http'
import type { BookDto, CreateBookDto } from '../types/dtos'

export const booksService = {
  getAll: () => http<BookDto[]>('/api/Books'),
  getById: (id: number) => http<BookDto>(`/api/Books/${id}`),
  search: (q: string) => http<BookDto[]>(`/api/Books/search?q=${encodeURIComponent(q)}`),
  recent: (take = 5) => http<BookDto[]>(`/api/Books/recent?take=${take}`),
  create: (input: CreateBookDto) =>
    http<BookDto>('/api/Books', { method: 'POST', body: JSON.stringify(input) }),
}