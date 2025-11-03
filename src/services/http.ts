// src/services/http.ts
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, ""); // trim trailing slash

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  // Build absolute URL from env base + path
  const url =
    /^https?:\/\//i.test(path)
      ? path
      : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  // 204 No Content
  // @ts-expect-error allow void for 204
  return res.status === 204 ? undefined : ((await res.json()) as T);
}
