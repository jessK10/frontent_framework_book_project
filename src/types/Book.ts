export type Book = {
  id?: number;
  title: string;
  authorId: number | null; // form may start as null
  publishedYear: number;
  isbn?: string;
  coverUrl?: string;
  description?: string;
};
