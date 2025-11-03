import { http } from "./http";
import type { AuthorDto, CreateAuthorDto } from "../types/dtos";

export const authorsService = {
  getAll: () => http<AuthorDto[]>("/api/Authors"),

  create: (input: CreateAuthorDto) =>
    http<AuthorDto>("/api/Authors", { method: "POST", body: JSON.stringify(input) }),

  // NEW: delete an author
  remove: (id: number) => http<void>(`/api/Authors/${id}`, { method: "DELETE" }),
};
