import { http } from "./http";
import type { BookDto, CreateBookDto } from "../types/dtos";

export const booksService = {
  getAll: (): Promise<BookDto[]> => http<BookDto[]>("/api/Books"),
  getById: (id: number): Promise<BookDto> => http<BookDto>(`/api/Books/${id}`),
  search: (q: string): Promise<BookDto[]> =>
    http<BookDto[]>(`/api/Books/search?q=${encodeURIComponent(q)}`),
  recent: (take = 5): Promise<BookDto[]> =>
    http<BookDto[]>(`/api/Books/recent?take=${take}`),

  create: (input: CreateBookDto): Promise<BookDto> =>
    http<BookDto>("/api/Books", { method: "POST", body: JSON.stringify(input) }),

  // NEW: delete a book
  remove: (id: number): Promise<void> =>
    http<void>(`/api/Books/${id}`, { method: "DELETE" }),
};
