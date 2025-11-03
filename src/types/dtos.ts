// Authors
export type AuthorDto = {
  id: number;
  name: string;
};

export type CreateAuthorDto = {
  name: string;
};

// Books (API response shape + optional UI extras)
export type BookDto = {
  id: number;
  title: string;
  year: number;
  authorId?: number | null;
  authorName?: string | null;

  // UI-only (may be absent in API)
  isbn?: string;
  coverUrl?: string;
  description?: string;
};

export type CreateBookDto = {
  title: string;
  year: number;
  authorId?: number | null;
  // keep CreateBookDto minimal because backend doesn't accept extras in Option B
};
