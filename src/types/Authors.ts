export type Author = {
  id: number;
  name: string;
  bio: string;
  birthYear: number;
  country: string;
};

// Use this for create/update payloads where `id` is not provided by the form
export type AuthorInput = Omit<Author, "id">;
